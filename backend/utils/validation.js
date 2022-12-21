const { validationResult } = require('express-validator');
const { SequelizeValidationError } = require('../errors');
const { check } = require('express-validator');

// formats errors via express-validator mw
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => `${error.msg}`);

        const err = new SequelizeValidationError({ errors });

        next(err);
    }

    next();
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
            // Is a valid latitude
            return value >= -90 && value <= 90;
        }
    ),
    check('lng', 'Longitude is not valid. Must be between -180 and 180').custom(
        (value) => {
            // Is a valid longitude
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

module.exports = {
    spotValidationMiddleware,
    handleValidationErrors,
};
