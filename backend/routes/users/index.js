/**
 * This is the router for all user related routes.
 */

const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {
    AuthenticationError,
    SequelizeValidationError,
    ForbiddenError,
} = require('../../errors');
const { User } = require('../../db/models');
const {
    setTokenCookie,
    restoreUser,
    requireAuth,
} = require('../../utils/auth');

const router = express.Router();

router.use(restoreUser);

/**
 * Get the current user
 * Method: GET
 * Route: /users/current
 */
router.get('/current', requireAuth, (req, res) => {
    if (req.user) {
        return res.json({
            user: req.user.toSafeObject(),
        });
    }

    return res.json({
        user: null,
    });
});

/**
 * Login a user
 * Method: POST
 * Route: /users/login
 */
router.post(
    '/login',
    [
        check('credential')
            .exists({ checkFalsy: true })
            .withMessage('Email or username is required'),
        check('password')
            .exists({ checkFalsy: true })
            .withMessage('Password is required'),
        handleValidationErrors,
    ],
    async (req, res, next) => {
        const { credential, password } = req.body;

        try {
            const user = await User.login({ credential, password });

            if (!user) {
                const error = new AuthenticationError({
                    message: 'Invalid credentials',
                });

                return next(error);
            }

            return res.json({
                user: {
                    ...user.toSafeObject(),
                    token: await setTokenCookie(res, user),
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * Sign up a user
 * Method: POST
 * Route: /users/signup
 */
router.post(
    '/signup',
    [
        check('email')
            .exists({ checkFalsy: true })
            .withMessage('Email is required'),
        check('email').isEmail().withMessage('Invalid email'),
        check('username')
            .exists({ checkFalsy: true })
            .withMessage('Username is required'),
        check('firstName')
            .exists({ checkFalsy: true })
            .withMessage('First name is required'),
        check('lastName')
            .exists({ checkFalsy: true })
            .withMessage('Last name is required'),
        check('password')
            .exists({ checkFalsy: true })
            .withMessage('Password is required'),
        handleValidationErrors,
    ],
    async (req, res) => {
        const { firstName, lastName, email, username, password } = req.body;

        const user = await User.signup({
            firstName,
            lastName,
            email,
            username,
            password,
        });

        if (!(user instanceof User)) {
            const errorMessages = user?.errors?.map((error) => {
                return error.message;
            });

            const statusCode = 403;
            const responseMessage = new ForbiddenError({
                message: 'User already exists',
                errors: errorMessages,
            });

            return res.status(statusCode).json(responseMessage);
        }

        return res.json({
            user: {
                ...user.toSafeObject(),
                token: await setTokenCookie(res, user),
            },
        });
    }
);

module.exports = router;
