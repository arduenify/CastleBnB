const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { AuthenticationError, ForbiddenError } = require('../../errors');
const { User, Spot, Review, ReviewImage, Booking } = require('../../db/models');
const {
    setTokenCookie,
    restoreUser,
    requireAuthentication,
} = require('../../utils/auth');
const { toReadableDateUTC, formatDate } = require('../../utils/format_date');

const Sequelize = require('sequelize');

const router = express.Router();

router.use(restoreUser);

/**
 * Get the current user
 * Method: GET
 * Route: /users/current
 */
router.get('/current', (req, res) => {
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
    async (req, res, next) => {
        try {
            const { firstName, lastName, email, username, password } = req.body;

            const user = await User.signup({
                firstName,
                lastName,
                email,
                username,
                password,
            });

            if (!(user instanceof User)) {
                // const errorMessages = user?.errors?.map((error) => {
                //     return error.message;
                // });
                const errorMessages = [];

                if (user?.errors?.length) {
                    // I am not the biggest fan, but am pressed for time...
                    // It is not clear to me in the documentation if I need to return both errors. Since they are unique constraints, it is difficult to get both errors back from the database.

                    const duplicateEmail = await User.findOne({
                        where: { email },
                    });

                    if (duplicateEmail) {
                        errorMessages.push(
                            'User with that email already exists'
                        );
                    }

                    const duplicateUsername = await User.findOne({
                        where: { username },
                    });

                    if (duplicateUsername) {
                        errorMessages.push(
                            'User with that username already exists'
                        );
                    }
                }

                throw new ForbiddenError({
                    message: 'User already exists',
                    errors: errorMessages,
                });
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
 * Get all spots owned by the current user
 * Method: GET
 * Route: /users/current/spots
 */
router.get('/current/spots', requireAuthentication, async (req, res, next) => {
    try {
        const spots = await req.user.getSpots({
            include: [
                {
                    association: 'previewImage',
                    attributes: ['url'],
                },
            ],
            group: ['Spot.id', 'previewImage.id'],
        });

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
                group: ['Review.id', 'User.id', 'Spot.id', 'ReviewImages.id'],
            });

            for (const review of reviews) {
                const spot = review.Spot;
                const previewImage = await spot.getPreviewImage();

                spot.dataValues.previewImage = previewImage?.url || null;

                review.dataValues.createdAt = formatDate(review.createdAt);
                review.dataValues.updatedAt = formatDate(review.updatedAt);

                review.dataValues.Spot = {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    price: spot.price,
                    previewImage: spot.dataValues.previewImage,
                };
            }

            return res.json({ Reviews: reviews });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * Get all of the current user's bookings
 * Require authentication: true
 * Method: GET
 * Route: /users/current/bookings
 */
router.get(
    '/current/bookings',
    requireAuthentication,
    async (req, res, next) => {
        try {
            const bookings = await req.user.getBookings({
                attributes: [
                    'id',
                    'startDate',
                    'endDate',
                    'spotId',
                    'userId',
                    'createdAt',
                    'updatedAt',
                ],
                include: [
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
                ],
                group: ['Booking.id', 'Spot.id'],
            });

            for (const booking of bookings) {
                const spot = booking.Spot;
                const previewImage = await spot.getPreviewImage();

                spot.dataValues.previewImage = previewImage?.url || null;
                spot.previewImage = previewImage?.url || null;

                // booking.dataValues.Spot = {
                //     id: spot.id,
                //     ownerId: spot.ownerId,
                //     address: spot.address,
                //     city: spot.city,
                //     state: spot.state,
                //     country: spot.country,
                //     lat: spot.lat,
                //     lng: spot.lng,
                //     name: spot.name,
                //     price: spot.price,
                //     previewImage: spot.dataValues.previewImage,
                // };
            }

            const formattedBookings = bookings.map((booking) => {
                const startDate = toReadableDateUTC(booking.startDate);
                const endDate = toReadableDateUTC(booking.endDate);

                booking.Spot = {
                    id: booking.Spot.id,
                    ownerId: booking.Spot.ownerId,
                    address: booking.Spot.address,
                    city: booking.Spot.city,
                    state: booking.Spot.state,
                    country: booking.Spot.country,
                    lat: booking.Spot.lat,
                    lng: booking.Spot.lng,
                    name: booking.Spot.name,
                    price: booking.Spot.price,
                    previewImage: booking.Spot.previewImage,
                };

                return {
                    id: booking.id,
                    spotId: booking.spotId,
                    Spot: booking.Spot,
                    userId: booking.userId,
                    startDate,
                    endDate,
                    createdAt: formatDate(booking.createdAt),
                    updatedAt: formatDate(booking.updatedAt),
                };
            });

            return res.json({ Bookings: formattedBookings });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
