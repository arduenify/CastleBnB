// Create the reviews router
const express = require('express');
const router = express.Router();
const { restoreUser, requireAuthentication } = require('../../utils/auth');
const { Review, ReviewImage, Spot } = require('../../db/models');
const { ResourceNotFoundError, ForbiddenError } = require('../../errors');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { formatDate } = require('../../utils/format_date');

router.use(restoreUser);

/**
 * Create and return a new image for a review specified by the reviewId
 * Require authentication: true
 * Method: POST
 * Route: /reviews/:reviewId/images
 * Params: reviewId
 */
router.post(
    '/:reviewId/images',
    requireAuthentication,

    async (req, res, next) => {
        const { reviewId } = req.params;
        const { url } = req.body;

        try {
            const review = await Review.findByPk(reviewId);

            if (!review) {
                throw new ResourceNotFoundError({
                    message: "Review couldn't be found",
                });
            }

            const reviewImages = await ReviewImage.findAll({
                where: { reviewId },
            });

            if (reviewImages.length >= 10) {
                throw new ForbiddenError({
                    message:
                        'Maximum number of images for this resource was reached',
                });
            }

            const reviewImage = await review.createReviewImage({ url });

            return res.json({
                id: reviewImage.id,
                url: reviewImage.url,
            });
        } catch (error) {
            return next(error);
        }
    }
);

/**
 * Update and return an existing review
 * Require authentication: true
 * Method: PUT
 * Route: /reviews/:reviewId
 * Params: reviewId
 * Body: { review, stars }
 */
router.put(
    '/:reviewId',
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
    ],
    handleValidationErrors,
    async (req, res, next) => {
        const { reviewId } = req.params;
        const { review } = req.body;
        let { stars } = req.body;

        if (typeof stars !== 'number') {
            stars = parseInt(stars);
        }

        try {
            const reviewInstance = await Review.findByPk(reviewId);

            if (!reviewInstance) {
                throw new ResourceNotFoundError({
                    message: "Review couldn't be found",
                });
            }

            if (reviewInstance.userId !== req.user.id) {
                throw new ForbiddenError({
                    message: 'Review must belong to the current user',
                });
            }

            await reviewInstance.update({ review, stars });

            reviewInstance.dataValues.createdAt = formatDate(
                reviewInstance.createdAt
            );
            reviewInstance.dataValues.updatedAt = formatDate(
                reviewInstance.updatedAt
            );

            return res.json(reviewInstance);
        } catch (error) {
            return next(error);
        }
    }
);

/**
 * Delete an existing review
 * Require authentication: true
 * Require proper authorization: Review must belong to the current user
 * Method: DELETE
 * Route: /reviews/:reviewId
 * Params: reviewId
 */
router.delete('/:reviewId', requireAuthentication, async (req, res, next) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            throw new ResourceNotFoundError({
                message: "Review couldn't be found",
            });
        }

        if (review.userId !== req.user.id) {
            throw new ForbiddenError({
                message: 'Review must belong to the current user',
            });
        }

        await review.destroy();

        return res.json({ message: 'Successfully deleted', statusCode: 200 });
    } catch (error) {
        return next(error);
    }
});

/**
 * Delete an existing image for a Review
 * Require authentication: true
 * Authorization: Review must belong to the current user
 * Method: DELETE
 * Route: /reviews/:reviewId/images/:imageId
 * Params: reviewId, imageId
 */
router.delete(
    '/:reviewId/images/:imageId',
    requireAuthentication,
    async (req, res, next) => {
        const { reviewId, imageId } = req.params;

        try {
            const review = await Review.findByPk(reviewId);

            if (!review) {
                throw new ResourceNotFoundError({
                    message: "Review Image couldn't be found",
                });
            }

            if (review.userId !== req.user.id) {
                throw new ForbiddenError({
                    message: 'Review must belong to the current user',
                });
            }

            const reviewImage = await ReviewImage.findByPk(imageId);

            if (!reviewImage) {
                throw new ResourceNotFoundError({
                    message: "Review Image couldn't be found",
                });
            }

            await reviewImage.destroy();

            return res.json({
                message: 'Successfully deleted',
                statusCode: 200,
            });
        } catch (error) {
            return next(error);
        }
    }
);

module.exports = router;
