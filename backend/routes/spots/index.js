const express = require('express');
const { check } = require('express-validator');
const Sequelize = require('sequelize');
const {
    Spot,
    Review,
    User,
    ReviewImage,
    SpotImage,
} = require('../../db/models');
const { ResourceNotFoundError, ForbiddenError } = require('../../errors');
const { requireAuthentication, restoreUser } = require('../../utils/auth');
const {
    spotValidationMiddleware,
    handleValidationErrors,
    spotQueryFilterValidationMiddleware,
} = require('../../utils/validation');
const { toReadableDateUTC, formatDate } = require('../../utils/format_date');

const router = express.Router();
router.use(restoreUser);

/**
 * Get all spots
 * Supports query filters for minLat, maxLat, minLng, maxLng, minPrice, maxPrice
 * Also supports pagination with page and size query params
 *
 * Method: GET
 * Route: /spots
 */
router.get('/', spotQueryFilterValidationMiddleware, async (req, res, next) => {
    try {
        const {
            // page,
            // size,
            minLat,
            maxLat,
            minLng,
            maxLng,
            minPrice,
            maxPrice,
        } = req.query;

        let { page, size } = req.query;

        const hasQueryFilters = Object.keys(req.query).length;
        const query = {};

        // Query filters exist
        if (hasQueryFilters) {
            const where = {};

            if (Number.isNaN(page)) {
                page = parseInt(page);
            }

            if (Number.isNaN(size)) {
                size = parseInt(size);
            }

            if (page > 10) {
                page = 10;
            }

            if (size > 20) {
                size = 20;
            }

            if ('minLat' in req.query) {
                where.lat = { [Sequelize.Op.gte]: minLat };
            }

            if ('maxLat' in req.query) {
                where.lat = { ...where.lat, [Sequelize.Op.lte]: maxLat };
            }

            if ('minLng' in req.query) {
                where.lng = { [Sequelize.Op.gte]: minLng };
            }

            if ('maxLng' in req.query) {
                where.lng = { ...where.lng, [Sequelize.Op.lte]: maxLng };
            }

            if ('minPrice' in req.query) {
                where.price = { [Sequelize.Op.gte]: minPrice };
            }

            if ('maxPrice' in req.query) {
                where.price = { ...where.price, [Sequelize.Op.lte]: maxPrice };
            }

            query.where = where;
            query.limit = size;
            query.offset = (page - 1) * size;
        }

        const spots = await Spot.findAll(query);

        for (const spot of spots) {
            if (!hasQueryFilters) {
                const reviewAverageRating = await Review.findOne({
                    attributes: [
                        [
                            Sequelize.fn('AVG', Sequelize.col('stars')),
                            'avgRating',
                        ],
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

            const previewImage = await SpotImage.findOne({
                where: { spotId: spot.id, preview: true },
            });

            if (previewImage) {
                spot.dataValues.previewImage = previewImage.dataValues;
            } else {
                spot.dataValues.previewImage = null;
            }
        }

        let formattedSpots;
        if (hasQueryFilters) {
            formattedSpots = await Spot.formatSpotsQueryResponse(
                spots,
                page,
                size
            );
        } else {
            formattedSpots = await Spot.formatSpotsResponse(spots);
        }

        res.json(formattedSpots);
    } catch (err) {
        next(err);
    }
});

/**
 * Returns the details of a spot specified by its id
 * Method: GET
 * Route: /spots/:id
 * Params: spotId
 */
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId, {
            include: [
                // {
                //     association: 'SpotImage',
                //     attributes: ['id', 'url', 'preview'],
                // },
                {
                    association: 'Owner',
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: Review,
                    attributes: [], // don't include 'Reviews: []'
                },
            ],
            group: ['Spot.id', 'Owner.id'],
            attributes: {
                include: [
                    [
                        Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
                        'avgStarRating',
                    ],
                ],
            },
        });

        if (!spot || !spot.dataValues.id) {
            throw new ResourceNotFoundError({
                message: "Spot couldn't be found",
            });
        }

        const spotImages = await spot.getSpotImages({
            attributes: ['id', 'url', 'preview'],
        });
        spot.dataValues.SpotImages = spotImages;

        const numReviews = await Review.count({
            where: { spotId: spot.id },
        });

        const formattedSpot = await Spot.formatResponse(spot, numReviews);

        res.json(formattedSpot);
    } catch (err) {
        next(err);
    }
});

/**
 * Create a new spot
 * Method: POST
 * Route: /spots
 * Body: { address, city, state, country, lat, lng, name, description, price }
 */
router.post(
    '/',
    requireAuthentication,
    spotValidationMiddleware,
    async (req, res, next) => {
        try {
            const {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            } = req.body;

            const { id } = req.user;

            const spot = await Spot.create({
                ownerId: id,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            });

            spot.dataValues.updatedAt = formatDate(spot.dataValues.updatedAt);
            spot.dataValues.createdAt = formatDate(spot.dataValues.createdAt);

            res.status(201).json({
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Edit a spot
 * Method: PUT
 * Route: /spots/:spotId
 * Params: spotId
 * Body: { address, city, state, country, lat, lng, name, description, price }
 */
router.put(
    '/:spotId',
    requireAuthentication,
    spotValidationMiddleware,
    async (req, res, next) => {
        try {
            const spotId = req.params.spotId;

            const {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            } = req.body;

            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            if (spot.dataValues.ownerId !== req.user.id) {
                throw new ForbiddenError({
                    message: 'Spot must belong to the current user',
                });
            }

            await spot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            });

            spot.dataValues.updatedAt = formatDate(spot.dataValues.updatedAt);
            spot.dataValues.createdAt = formatDate(spot.dataValues.createdAt);

            res.json({
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Delete a spot
 * Method: DELETE
 * Route: /spots/:spotId
 * Params: spotId
 */
router.delete('/:spotId', requireAuthentication, async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId);

        if (!spot || !spot.dataValues.id) {
            throw new ResourceNotFoundError({
                message: "Spot couldn't be found",
            });
        }

        if (spot.dataValues.ownerId !== req.user.id) {
            throw new ForbiddenError({
                message: 'Spot must belong to the current user',
            });
        }

        await spot.destroy();

        res.json({
            message: 'Successfully deleted',
            statusCode: 200,
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Add a spot image
 * Method: POST
 * Route: /spots/:spotId/images
 * Params: spotId
 * Body: { url, preview }
 */
router.post(
    '/:spotId/images',
    requireAuthentication,
    async (req, res, next) => {
        try {
            const spotId = req.params.spotId;
            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            if (spot.dataValues.ownerId !== req.user.id) {
                throw new ForbiddenError({
                    message: 'Spot must belong to the current user',
                });
            }

            // This is because of the unique index on SpotImage(spotId, preview)
            // Since there can only be one preview image, this will resolve the issue
            //      by updating the current preview image to not be a preview image
            const previewImage = await SpotImage.findOne({
                where: { spotId, preview: true },
            });

            if (previewImage) {
                await previewImage.update({ preview: false });
            }

            const { url, preview } = req.body;

            const spotImage = await spot.createSpotImage({
                url,
                preview,
            });

            res.json({
                id: spotImage.dataValues.id,
                url: spotImage.dataValues.url,
                preview: spotImage.dataValues.preview,
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Get all reviews for a spot by :spotId
 * Method: GET
 * Route: /spots/:spotId/reviews
 * Params: spotId
 */
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId);

        if (!spot || !spot.dataValues.id) {
            throw new ResourceNotFoundError({
                message: "Spot couldn't be found",
            });
        }

        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'],
                },
            ],
            group: ['Review.id', 'User.id', 'ReviewImages.id'],
        });

        for (const review of reviews) {
            review.dataValues.createdAt = formatDate(
                review.dataValues.createdAt
            );
            review.dataValues.updatedAt = formatDate(
                review.dataValues.updatedAt
            );
        }

        res.json({ Reviews: reviews });
    } catch (err) {
        next(err);
    }
});

/**
 * Create and return a new review for a spot specified by id
 * Require authentication
 * Method: POST
 * Route: /spots/:spotId/reviews
 * Params: spotId
 * Body: { review, stars }
 */
router.post(
    '/:spotId/reviews',
    requireAuthentication,
    [
        check('review')
            .exists({ checkFalsy: true })
            .withMessage('Review text is required'),
        check('stars')
            .custom((value) => {
                if (!value || isNaN(value) || value < 1 || value > 5) {
                    return false;
                }

                return true;
            })
            .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors,
    ],
    async (req, res, next) => {
        try {
            const spotId = parseInt(req.params.spotId);

            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            const { review } = req.body;
            let { stars } = req.body;

            if (typeof stars !== 'number') {
                stars = parseInt(stars);
            }

            const reviewInstance = await Review.create({
                userId: req.user.id,
                spotId,
                review,
                stars,
            });

            reviewInstance.dataValues.createdAt = formatDate(
                reviewInstance.dataValues.createdAt
            );
            reviewInstance.dataValues.updatedAt = formatDate(
                reviewInstance.dataValues.updatedAt
            );

            res.status(201).json(reviewInstance);
        } catch (err) {
            if (err instanceof Sequelize.UniqueConstraintError) {
                const error = new ForbiddenError({
                    message: 'User already has a review for this spot',
                });

                return next(error);
            }

            next(err);
        }
    }
);

/**
 * Get all Bookings for a Spot based on :spotId
 * Method: GET
 * Route: /spots/:spotId/bookings
 * Params: spotId
 * Require authentication
 */
router.get(
    '/:spotId/bookings',
    requireAuthentication,
    async (req, res, next) => {
        try {
            const spotId = req.params.spotId;

            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            const userIsSpotOwner = spot.dataValues.ownerId === req.user.id;

            let queryOptions = {};
            if (!userIsSpotOwner) {
                queryOptions = {
                    where: { spotId },
                    attributes: ['spotId', 'startDate', 'endDate'],
                };
            } else {
                queryOptions = {
                    where: { spotId },
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName'],
                        },
                    ],
                    group: ['User.id', 'Booking.id'],
                };
            }
            const bookings = await spot.getBookings(queryOptions);

            // Todo move this formatter to the model
            const formattedBookings = bookings.map((booking) => {
                const { User, ...allOther } = booking.dataValues;

                allOther.startDate = toReadableDateUTC(allOther.startDate);
                allOther.endDate = toReadableDateUTC(allOther.endDate);

                if (userIsSpotOwner) {
                    allOther.createdAt = formatDate(allOther.createdAt);
                    allOther.updatedAt = formatDate(allOther.updatedAt);

                    return { User, ...allOther };
                }

                return allOther;
            });

            res.json({ Bookings: formattedBookings });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Create and return a new booking from a spot specified by id
 * Require authentication
 * Authorization: Spot must NOT belong to the current user
 * Method: POST
 * Route: /spots/:spotId/bookings
 * Params: spotId
 * Body: { startDate, endDate }
 */
router.post(
    '/:spotId/bookings',
    requireAuthentication,
    [
        check('startDate')
            .exists({ checkFalsy: true })
            .withMessage('Start date is required'),
        check('endDate')
            .exists({ checkFalsy: true })
            .withMessage('End date is required'),
        check('endDate')
            .custom((value, { req }) => {
                const { startDate } = req.body;

                return value > startDate;
            })
            .withMessage('endDate cannot be on or before startDate'),
        handleValidationErrors,
    ],
    async (req, res, next) => {
        try {
            const spotId = parseInt(req.params.spotId);

            const spot = await Spot.findByPk(spotId);

            if (!spot || !spot.dataValues.id) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            if (spot.dataValues.ownerId === req.user.id) {
                throw new ForbiddenError({
                    message: 'Spot must NOT belong to the current user',
                });
            }

            const { startDate, endDate } = req.body;

            const bookingConflicts = await spot.checkBookingConflicts(
                startDate,
                endDate
            );

            if (bookingConflicts) {
                throw new ForbiddenError({
                    message:
                        'Sorry, this spot is already booked for the specified dates',
                    errors: bookingConflicts.errors,
                });
            }

            const booking = await spot.createBooking({
                userId: req.user.id,
                startDate,
                endDate,
            });

            res.status(201).json({
                id: booking.dataValues.id,
                spotId: booking.dataValues.spotId,
                userId: booking.dataValues.userId,
                startDate: toReadableDateUTC(booking.dataValues.startDate),
                endDate: toReadableDateUTC(booking.dataValues.endDate),
                createdAt: formatDate(booking.dataValues.createdAt),
                updatedAt: formatDate(booking.dataValues.updatedAt),
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Delete an existing image for a Spot
 * Require authentication
 * Authorization: Spot must belong to the current user
 * Method: DELETE
 * Route: /spots/:spotId/images/:imageId
 * Params: spotId, imageId
 */
router.delete(
    '/:spotId/images/:imageId',
    requireAuthentication,
    async (req, res, next) => {
        try {
            const spotId = req.params.spotId;
            const imageId = req.params.imageId;

            const spot = await Spot.findByPk(spotId);

            if (!spot) {
                throw new ResourceNotFoundError({
                    message: "Spot Image couldn't be found",
                });
            }

            if (spot.dataValues.ownerId !== req.user.id) {
                throw new ForbiddenError({
                    message: 'Spot must belong to the current user',
                });
            }

            const image = await SpotImage.findByPk(imageId);

            if (!image) {
                throw new ResourceNotFoundError({
                    message: "Spot Image couldn't be found",
                });
            }

            await image.destroy();

            res.status(200).json({
                message: 'Successfully deleted',
                statusCode: 200,
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
