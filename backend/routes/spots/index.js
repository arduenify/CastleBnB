const express = require('express');
const Sequelize = require('sequelize');
const { check } = require('express-validator');

const router = express.Router();

const { Spot, Review } = require('../../db/models');
const {
    ResourceNotFoundError,
    SequelizeValidationError,
} = require('../../errors');
const { requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

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
router.get('/:spotId', handleValidationErrors, async (req, res, next) => {
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
            // spot doesn't exist
            const spotNotFoundError = new ResourceNotFoundError({
                message: "Spot couldn't be found",
            });

            return next(spotNotFoundError);
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
    [
        check('address')
            .exists({ checkFalsy: true })
            .withMessage('Street address is required'),
        check('city')
            .exists({ checkFalsy: true })
            .withMessage('City is required'),
        check('state')
            .exists({ checkFalsy: true })
            .withMessage('State is required'),
        check('country')
            .exists({ checkFalsy: true })
            .withMessage('Country is required'),
        check(
            'lat',
            'Latitude is not valid. Must be between -90 and 90'
        ).custom((value) => {
            // Is a valid latitude
            return value >= -90 && value <= 90;
        }),
        check(
            'lng',
            'Longitude is not valid. Must be between -180 and 180'
        ).custom((value) => {
            // Is a valid longitude
            return value >= -180 && value <= 180;
        }),
        check('name')
            .exists({ checkFalsy: true })
            .withMessage('Name is required'),
        check('name')
            .isLength({ max: 50 })
            .withMessage('Name must be less than 50 characters'),
        check('description')
            .exists({ checkFalsy: true })
            .withMessage('Description is required'),
        check('price')
            .exists({ checkFalsy: true })
            .withMessage('Price per day is required'),
        handleValidationErrors,
    ],
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

module.exports = router;
