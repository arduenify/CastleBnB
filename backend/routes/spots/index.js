const express = require('express');

const { Spot, SpotImage } = require('../../db/models');

const router = express.Router();

/**
 * Get all spots
 * Method: GET
 * Route: /spots
 */
router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            include: {
                model: SpotImage,
                attributes: ['url'],
            },
        });

        res.json(spots);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
