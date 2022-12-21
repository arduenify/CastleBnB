const express = require('express');

const router = express.Router();

const { Spot } = require('../../db/models');
const {
    ResourceNotFoundError,
    SequelizeValidationError,
} = require('../../errors');
const { handleValidationErrors } = require('../../utils/validation');

/**
 * Get all spots
 * Method: GET
 * Route: /spots
 */
router.get('/', handleValidationErrors, async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            include: {
                association: 'previewImage',
                attributes: ['url'],
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
        const spot = await Spot.findByPk(req.params.spotId, {
            include: [
                {
                    association: 'SpotImages',
                    attributes: ['id', 'url', 'preview'],
                },
                {
                    association: 'Owner',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });

        if (!spot) {
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

module.exports = router;
