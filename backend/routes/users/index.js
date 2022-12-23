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
const { User, Spot, Review, ReviewImage } = require('../../db/models');
const {
    setTokenCookie,
    restoreUser,
    requireAuthentication,
} = require('../../utils/auth');

const Sequelize = require('sequelize');

const router = express.Router();

router.use(restoreUser);

/**
 * Get the current user
 * Method: GET
 * Route: /users/current
 */
router.get('/current', requireAuthentication, (req, res) => {
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

/**
 * Get all spots owned by the current user
 * Method: GET
 * Route: /users/current/spots
 */
router.get('/current/spots', requireAuthentication, async (req, res, next) => {
    try {
        const spots = await req.user.getSpots();

        for (const spot of spots) {
            const reviewAverageRating = await Review.findOne({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating'],
                ],
                where: { spotId: spot.id },
            });

            if (!reviewAverageRating.dataValues.avgRating) {
                spot.dataValues.avgRating = null;
            } else {
                spot.dataValues.avgRating =
                    reviewAverageRating.dataValues.avgRating;
            }
        }

        const formattedSpots = Spot.formatSpotsResponse(spots);

        return res.json(formattedSpots);
    } catch (error) {
        next(error);
    }
});

/**
 * Returns all the reviews written by the current user
 * Method: GET
 * Route: /users/current/reviews
 */
router.get(
    '/current/reviews',
    requireAuthentication,
    async (req, res, next) => {
        try {
            const reviews = await Review.findAll({
                where: { userId: req.user.id },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                    {
                        model: Spot,
                        attributes: [
                            'id',
                            'ownerId',
                            'address',
                            'city',
                            'state',
                            'country',
                            'lat',
                            'lng',
                            'name',
                            'price',
                        ],
                    },
                    {
                        model: ReviewImage,
                        attributes: ['id', 'url'],
                    },
                ],
            });

            for (const review of reviews) {
                const spot = review.Spot;
                const previewImage = await spot.getPreviewImage();

                spot.dataValues.previewImage = previewImage?.url || null;
            }

            return res.json({ Reviews: reviews });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
