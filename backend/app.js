require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const routes = require('./routes');

// Errors
const {
    ResourceNotFoundError,
    ForbiddenError,
    InternalServerError,
    ApiError,
    SequelizeValidationError,
    BadRequestError,
} = require('./errors');
const { ValidationError } = require('sequelize');

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Production will use the same origin as the frontend
if (!isProduction) {
    app.use(cors());
}

// Security middleware
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-origin' }));

// CSRF protection
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && 'Lax',
            httpOnly: true,
        },
    })
);

// Routes
app.use(routes);

// Resource not found error
app.use((_req, _res, next) => {
    const resourceNotFoundError = new ResourceNotFoundError();

    return next(resourceNotFoundError);
});

// Catch the errors
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
    }

    if (err instanceof ApiError) {
        // Custom errors
        return err.send(res);
    }

    if (err instanceof ValidationError) {
        // Sequelize validation errors
        const badRequestError = new BadRequestError({ message: err.message });

        return badRequestError.send(res);
    }

    // CSURF error
    if (err.code === 'EBADCSRFTOKEN') {
        const forbiddenError = new ForbiddenError(
            'Invalid CSRF token. Please try again.'
        );

        return forbiddenError.send(res);
    }

    return new InternalServerError({
        message: 'Well, this is awkward... Something went wrong.',
        errors: err,
    }).send(res);
});

// Export
module.exports = app;
