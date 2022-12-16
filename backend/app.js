require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const { ValidationError } = require('sequelize');
const isProduction = environment === 'production';

const routes = require('./routes');

// Errors
const { ResourceNotFoundError } = require('./errors/not-found');
const { AuthorizationError } = require('./errors/authorization');
const { AuthenticationError } = require('./errors/authentication');

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

// Process sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }

    next(err);
});

/**
 * Catch unhandled requests.
 */
app.use((err, req, res, next) => {
    if (!(err instanceof ErrorResponse)) {
        return res.json({
            title: 'Well, this is awkward... Something went wrong.',
            message: err,
        });
    }

    err.send(res);
});

// Export
module.exports = app;
