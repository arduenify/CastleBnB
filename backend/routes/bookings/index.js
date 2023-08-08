const express = require('express');
const { check } = require('express-validator');
const Sequelize = require('sequelize');
const { ResourceNotFoundError, ForbiddenError } = require('../../errors');
const { requireAuthentication, restoreUser } = require('../../utils/auth');
const {
    spotValidationMiddleware,
    handleValidationErrors,
    spotQueryFilterValidationMiddleware,
} = require('../../utils/validation');
const { toReadableDateUTC, formatDate } = require('../../utils/format_date');
const { Booking, Spot } = require('../../db/models');

const router = express.Router();
router.use(restoreUser);

/**
 * Update and return an existing booking
 * Require authentication
 * Authorization: Booking must belong to the current user
 * Method: PUT
 * Route: /bookings/:bookingId
 * Request body: { startDate, endDate }
 */
router.put(
    '/:bookingId',
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
                const startDate = new Date(req.body.startDate);
                const endDate = new Date(value);

                return endDate > startDate;
            })
            .withMessage('endDate cannot come before startDate'),
        handleValidationErrors,
    ],
    async (req, res, next) => {
        const { bookingId } = req.params;
        const { user } = req;

        try {
            const booking = await Booking.findByPk(bookingId);

            if (!booking) {
                throw new ResourceNotFoundError({
                    message: "Booking couldn't be found",
                });
            }

            if (booking.userId !== user.id) {
                throw new ForbiddenError({
                    message: 'Booking must belong to the current user',
                });
            }

            if (booking.startDate < new Date()) {
                throw new ForbiddenError({
                    message: "Past bookings can't be modified",
                });
            }

            const { startDate, endDate } = req.body;

            const spot = await booking.getSpot();
            const bookingConflicts = await spot.checkBookingConflicts(
                startDate,
                endDate,
                bookingId
            );

            if (bookingConflicts) {
                throw new ForbiddenError({
                    message:
                        'Sorry, this spot is already booked for the specified dates',
                    errors: bookingConflicts.errors,
                });
            }

            booking.startDate = startDate;
            booking.endDate = endDate;

            await booking.save();

            res.json({
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: toReadableDateUTC(booking.startDate),
                endDate: toReadableDateUTC(booking.endDate),
                createdAt: formatDate(booking.createdAt),
                updatedAt: formatDate(booking.updatedAt),
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * Delete an existing booking
 * Require authentication
 * Authorization: Booking must belong to the current user or the Spot must belong to the current user
 * Method: DELETE
 * Route: /bookings/:bookingId
 */
router.delete('/:bookingId', requireAuthentication, async (req, res, next) => {
    const { bookingId } = req.params;
    const { user } = req;

    try {
        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            throw new ResourceNotFoundError({
                message: "Booking couldn't be found",
            });
        }

        if (user.id !== booking.userId) {
            const spot = await booking.getSpot();

            if (user.id !== spot.ownerId) {
                throw new ForbiddenError({
                    message:
                        'Booking must belong to the current user or the Spot must belong to the current user',
                });
            }
        }

        if (booking.startDate < new Date()) {
            throw new ForbiddenError({
                message: "Bookings that have been started can't be deleted",
            });
        }

        await booking.destroy();

        res.json({
            message: 'Successfully deleted',
            statusCode: 200,
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Create a new booking
 * Require authentication
 * Method: POST
 * Route: /bookings
 * Request body: { spotId, startDate, endDate }
 */
router.post(
    '/',
    requireAuthentication,
    [
        check('spotId')
            .exists({ checkFalsy: true })
            .withMessage('Spot ID is required'),
        check('startDate')
            .exists({ checkFalsy: true })
            .withMessage('Start date is required'),
        check('endDate')
            .exists({ checkFalsy: true })
            .withMessage('End date is required'),
        handleValidationErrors,
    ],
    async (req, res, next) => {
        const { spotId, startDate, endDate } = req.body;
        const { user } = req;

        try {
            const spot = await Spot.findByPk(spotId);
            if (!spot) {
                throw new ResourceNotFoundError({
                    message: "Spot couldn't be found",
                });
            }

            const bookingConflicts = await spot.checkBookingConflicts(
                startDate,
                endDate
            );

            console.log('found booking conflicts\n\n\n\n');

            if (bookingConflicts) {
                throw new ForbiddenError({
                    message:
                        'Sorry, this spot is already booked for the specified dates',
                    errors: bookingConflicts.errors,
                });
            }

            const booking = await Booking.create({
                spotId,
                userId: user.id,
                startDate,
                endDate,
            });

            res.json({
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: toReadableDateUTC(booking.startDate),
                endDate: toReadableDateUTC(booking.endDate),
                createdAt: formatDate(booking.createdAt),
                updatedAt: formatDate(booking.updatedAt),
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
