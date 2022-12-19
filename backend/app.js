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
    AuthorizationError,
    InternalServerError,
    ApiError,
} = require('./errors/api');

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

    next(resourceNotFoundError);
});

// Catch the errors
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }

    if (err instanceof ApiError) {
        return err.send(res);
    }

    // CSURF error
    if (err.code === 'EBADCSRFTOKEN') {
        return new AuthorizationError().send(res);
    }

    new InternalServerError(
        'Well, this is awkward... Something went wrong.',
        err
    ).send(res);
});

// Export
module.exports = app;
