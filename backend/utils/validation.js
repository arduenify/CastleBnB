const { validationResult } = require('express-validator');
const SequelizeValidationError = require('../errors/sequelize-validation');

// formats errors via express-validator mw
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => `${error.msg}`);

        const err = new SequelizeValidationError(errors);

        next(err);
    }

    next();
};

module.exports = {
    handleValidationErrors,
};
