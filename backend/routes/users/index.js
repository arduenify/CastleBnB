/**
 * This is the router for all user related routes.
 */

const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { AuthenticationError } = require('../../errors/api');
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
            .withMessage('Please provide a valid email or username.'),
        check('password')
            .exists({ checkFalsy: true })
            .withMessage('Please provide a valid password.'),
        handleValidationErrors,
    ],
    async (req, res, next) => {
        const { credential, password } = req.body;
        console.log('credential', credential);
        console.log('password', password);

        const user = await User.login({ credential, password });

        if (!user) {
            const error = new AuthenticationError('Invalid credentials');

            return next(error);
        }

        return res.json({
            user: {
                ...user.toSafeObject(),
                token: await setTokenCookie(res, user),
            },
        });
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
        check('firstName')
            .exists({ checkFalsy: true })
            .withMessage('Please provide a first name.'),
        check('lastName')
            .exists({ checkFalsy: true })
            .withMessage('Please provide a last name.'),
        check('email')
            .exists({ checkFalsy: true })
            .withMessage('Please provide an email.')
            .isEmail()
            .withMessage('Please provide a valid email.'),
        check('username')
            .exists({ checkFalsy: true })
            .withMessage('Please provide a username.'),
        check('password')
            .exists({ checkFalsy: true })
            .withMessage('Please provide a password.'),
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
            const responseMessage = {
                message: 'User already exists',
                statusCode,
                errors: errorMessages || [],
            };

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
