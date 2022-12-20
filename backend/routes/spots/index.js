const { Spot } = require('../../db/models');

const router = express.Router();

/**
 * Get all spots
 * Method: GET
 * Route: /spots
 */
router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll();

        res.json(spots);
    } catch (error) {
        next(error);
    }
});
