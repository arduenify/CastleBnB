const { validationResult } = require('express-validator');
const { SequelizeValidationError } = require('../errors');
const { check, query } = require('express-validator');

// formats errors via express-validator mw
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => `${error.msg}`);

        const err = new SequelizeValidationError({ errors });

        return next(err);
    }

    return next();
};

const spotValidationMiddleware = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city').exists({ checkFalsy: true }).withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat', 'Latitude is not valid. Must be between -90 and 90').custom(
        (value) => {
            return value >= -90 && value <= 90;
        }
    ),
    check('lng', 'Longitude is not valid. Must be between -180 and 180').custom(
        (value) => {
            return value >= -180 && value <= 180;
        }
    ),
    check('name').exists({ checkFalsy: true }).withMessage('Name is required'),
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
];

const spotQueryFilterValidationMiddleware = [
    query('page').exists({ checkFalsy: true }).withMessage('Page is required'),
    query('page')
        .isInt({ min: 0, max: 10 })
        .withMessage(
            'Page must be greater than or equal to 0, and less than or equal to 10'
        ),
    query('size').exists({ checkFalsy: true }).withMessage('Size is required'),
    query('size')
        .isInt({ min: 0, max: 20 })
        .withMessage(
            'Size must be greater than or equal to 0, and less than or equal to 20'
        ),
    query('minLat')
        .optional()
        .isFloat({ min: -90 })
        .withMessage('Min latitude is invalid'),
    query('maxLat')
        .optional()
        .isFloat({ max: 90 })
        .withMessage('Max latitude is invalid'),
    query('minLng')
        .optional()
        .isFloat({ min: -180 })
        .withMessage('Min longitude is invalid'),
    query('maxLng')
        .optional()
        .isFloat({ max: 180 })
        .withMessage('Max longitude is invalid'),
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Min price must be greater than or equal to 0'),
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Max price must be greater than or equal to 0'),
    async (req, res, next) => {
        // Skip validation if no query params are present
        if (Object.keys(req.query).length) {
            return handleValidationErrors(req, res, next);
        }

        return next();
    },
];

module.exports = {
    spotValidationMiddleware,
    spotQueryFilterValidationMiddleware,
    handleValidationErrors,
};
