const express = require('express');
const Sequelize = require('sequelize');
const { Spot, Review } = require('../../db/models');
const { ResourceNotFoundError, ForbiddenError } = require('../../errors');
const { requireAuth, restoreUser } = require('../../utils/auth');
const {
    spotValidationMiddleware,
    handleValidationErrors,
} = require('../../utils/validation');

const router = express.Router();
router.use(restoreUser);

/**
 * Get all spots
 * Method: GET
 * Route: /spots
 */
router.get('/', handleValidationErrors, async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
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
            attributes: {
                include: [
                    [
                        Sequelize.fn('AVG', Sequelize.col('reviews.stars')),
                        'averageRating',
                    ],
                ],
            },
        });

        const formattedSpots = Spot.formatSpotsResponse(spots);

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

module.exports = router;
