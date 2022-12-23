const express = require('express');
const { check } = require('express-validator');
const Sequelize = require('sequelize');
const { Spot, Review, User, ReviewImage } = require('../../db/models');
const { ResourceNotFoundError, ForbiddenError } = require('../../errors');
const { requireAuthentication, restoreUser } = require('../../utils/auth');
const {
    spotValidationMiddleware,
    handleValidationErrors,
    spotQueryFilterValidationMiddleware,
} = require('../../utils/validation');

const router = express.Router();
router.use(restoreUser);

/**
 * Get all spots
 * Supports query filters for minLat, maxLat, minLng, maxLng, minPrice, maxPrice
 * Also supports pagination with page and size query params
 *
 * Method: GET
 * Route: /spots
 */
router.get('/', spotQueryFilterValidationMiddleware, async (req, res, next) => {
    try {
        const {
            page = 0,
            size = 20,
            minLat,
            maxLat,
            minLng,
            maxLng,
            minPrice,
            maxPrice,
        } = req.query;

        if (isNaN(page)) {
            page = parseInt(page);
        }

        if (isNaN(size)) {
            size = parseInt(size);
        }

        const query = {
            include: [
                {
                    association: 'previewImage',
                    attributes: ['url'],
                },
                {
                    model: Review,
                    attributes: [],
                },
            ],
            group: ['Spot.id'],
            // This throws an error
            // attributes: {
            //     include: [
            //         [
            //             Sequelize.fn('AVG', Sequelize.col('reviews.stars')),
            //             'averageRating',
            //         ],
            //     ],
            // },
            // limit: size,
            // offset: page * (size - 1),
        };

        const where = {};
        if (minLat && maxLat) {
            where.lat = { [Sequelize.Op.between]: [minLat, maxLat] };
        }
        if (minLng && maxLng) {
            where.lng = { [Sequelize.Op.between]: [minLng, maxLng] };
        }
        if (minPrice && maxPrice) {
            where.price = { [Sequelize.Op.between]: [minPrice, maxPrice] };
        }

        if (Object.keys(where).length) {
            query.where = where;
        }

        if (size && page) {
            query.limit = size;
            query.offset = (page - 1) * size;
        }

        const spots = await Spot.findAll(query);

        for (const spot of spots) {
            const reviewAverageRating = await Review.findOne({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating'],
                ],
                where: { spotId: spot.id },
            });

            if (!reviewAverageRating.dataValues.avgRating) {
                spot.dataValues.avgRating = null;
            } else {
                spot.dataValues.avgRating =
                    reviewAverageRating.dataValues.avgRating;
            }
        }

        let formattedSpots;
        if (page && size) {
            formattedSpots = await Spot.formatSpotsQueryResponse(
                spots,
                page,
                size
            );
        } else {
            formattedSpots = await Spot.formatSpotsResponse(spots);
        }

        res.json(formattedSpots);
    } catch (err) {
        next(err);
    }
});

/**
 * Get a single spot by id
 * Method: GET
 * Route: /spots/:id
 * Params: spotId
 */
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    association: 'SpotImages',
                    attributes: ['id', 'url', 'preview'],
                },
                {
                    association: 'Owner',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: Review,
                    attributes: [], // don't include 'Reviews: []'
                },
            ],
            attributes: {
                include: [
                    [
                        Sequelize.fn('AVG', Sequelize.col('reviews.stars')),
                        'avgStarRating',
                    ],
                ],
            },
        });

        if (!spot || !spot.dataValues.id) {
            throw new ResourceNotFoundError({
                message: "Spot couldn't be found",
            });
        }

        const numReviews = await Review.count({
            where: { spotId: spot.id },
        });

        const formattedSpot = await Spot.formatResponse(spot, numReviews);

        res.json(formattedSpot);
    } catch (err) {
        next(err);
    }
});

/**
 * Create a new spot
 * Method: POST
 * Route: /spots
 * Body: { address, city, state, country, lat, lng, name, description, price }
 */
router.post(
    '/',
    requireAuthentication,
    spotValidationMiddleware,
    async (req, res, next) => {
        try {
            const {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            } = req.body;

            const { id } = req.user;

            const spot = await Spot.create({
                ownerId: id,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            });

            res.status(201).json(spot);
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Edit a spot
 * Method: PUT
 * Route: /spots/:spotId
 * Params: spotId
 * Body: { address, city, state, country, lat, lng, name, description, price }
 */
router.put(
    '/:spotId',
    requireAuthentication,
    spotValidationMiddleware,
    async (req, res, next) => {
        try {
            const spotId = req.params.spotId;

            const {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            } = req.body;

            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            if (spot.dataValues.ownerId !== req.user.id) {
                throw new ForbiddenError();
            }

            await spot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            });

            res.json(spot);
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Delete a spot
 * Method: DELETE
 * Route: /spots/:spotId
 * Params: spotId
 */
router.delete('/:spotId', requireAuthentication, async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId);

        if (!spot || !spot.dataValues.id) {
            throw new ResourceNotFoundError({
                message: "Spot couldn't be found",
            });
        }

        if (spot.dataValues.ownerId !== req.user.id) {
            throw new ForbiddenError();
        }

        await spot.destroy();

        res.json({
            message: 'Successfully deleted',
            statusCode: 200,
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Add a spot image
 * Method: POST
 * Route: /spots/:spotId/images
 * Params: spotId
 * Body: { url, preview }
 */
router.post(
    '/:spotId/images',
    requireAuthentication,
    async (req, res, next) => {
        try {
            const spotId = req.params.spotId;
            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            if (spot.dataValues.ownerId !== req.user.id) {
                throw new ForbiddenError();
            }

            const { url, preview } = req.body;

            const spotImage = await spot.createSpotImage({
                url,
                preview,
            });

            res.json(spotImage);
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Get all reviews for a spot by :spotId
 * Method: GET
 * Route: /spots/:spotId/reviews
 * Params: spotId
 */
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId);

        if (!spot || !spot.dataValues.id) {
            throw new ResourceNotFoundError({
                message: "Spot couldn't be found",
            });
        }

        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'],
                },
            ],
        });

        res.json({ Reviews: reviews });
    } catch (err) {
        next(err);
    }
});

/**
 * Create and return a new review for a spot specified by id
 * Require authentication
 * Method: POST
 * Route: /spots/:spotId/reviews
 * Params: spotId
 * Body: { review, stars }
 */
router.post(
    '/:spotId/reviews',
    requireAuthentication,
    [
        check('review')
            .exists({ checkFalsy: true })
            .withMessage('Review text is required'),
        check('stars')
            .custom((value) => {
                if (!value || isNaN(value) || value < 1 || value > 5) {
                    return false;
                }

                return true;
            })
            .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors,
    ],
    async (req, res, next) => {
        try {
            const spotId = parseInt(req.params.spotId);

            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            const { review } = req.body;
            let { stars } = req.body;

            if (typeof stars !== 'number') {
                stars = parseInt(stars);
            }

            const reviewInstance = await Review.create({
                userId: req.user.id,
                spotId,
                review,
                stars,
            });

            res.status(201).json(reviewInstance);
        } catch (err) {
            if (err instanceof Sequelize.UniqueConstraintError) {
                const error = new ForbiddenError({
                    message: 'User already has a review for this spot',
                });

                return next(error);
            }

            next(err);
        }
    }
);

module.exports = router;
