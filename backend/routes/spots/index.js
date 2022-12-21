const express = require('express');
const Sequelize = require('sequelize');
const { check } = require('express-validator');

const router = express.Router();

const { Spot, Review } = require('../../db/models');
const { ResourceNotFoundError } = require('../../errors');
const { requireAuth, restoreUser } = require('../../utils/auth');
const {
    spotValidationMiddleware,
    handleValidationErrors,
} = require('../../utils/validation');

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

        for (const spot of spots) {
            spot.dataValues.previewImage =
                spot.dataValues?.previewImage?.url ?? null;

            delete spot.dataValues.SpotImages; // safety first!
        }

        res.json(spots);
    } catch (err) {
        next(err);
    }
});

/**
 * Get a single spot by id
 * Method: GET
 * Route: /spots/:id
 * Params: id
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
 * Route: /spots/:id
 * Params: id
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

module.exports = router;
