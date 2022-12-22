const express = require('express');
const Sequelize = require('sequelize');
const { Spot, Review } = require('../../db/models');
const { ResourceNotFoundError, ForbiddenError } = require('../../errors');
const { requireAuth, restoreUser } = require('../../utils/auth');
const {
    spotValidationMiddleware,
    handleValidationErrors,
    spotQueryFilterValidationMiddleware,
} = require('../../utils/validation');

const router = express.Router();
router.use(restoreUser);

/**
 * Get all spots
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
                spot.avgRating = null;
            } else {
                spot.avgRating = reviewAverageRating.dataValues.avgRating;
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
                        Sequelize.fn('COUNT', Sequelize.col('reviews.stars')),
                        'numReviews',
                    ],
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

        res.json(spot);
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
    requireAuth,
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
    requireAuth,
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
router.delete('/:spotId', requireAuth, async (req, res, next) => {
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
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
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
});

module.exports = router;
