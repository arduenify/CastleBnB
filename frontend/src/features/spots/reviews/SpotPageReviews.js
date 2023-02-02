import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { getSpotReviewsById } from '../spotsSlice';
import './SpotPageReviews.css';
import ReviewItem from './ReviewItem';

const SpotPageReviews = ({ spotId, avgStarRating, numReviews }) => {
    const dispatch = useDispatch();

    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        dispatch(getSpotReviewsById(spotId)).then((reviews) => {
            console.log('REVIEW PAYLOAD:', reviews.payload);
            setReviews(reviews.payload.Reviews);
        });
    }, [dispatch, spotId]);

    useEffect(() => {
        console.log('Reviews changed to:', reviews);
    }, [reviews]);

    return (
        <div className='spot-page-reviews'>
            <div className='reviews-header'>
                <FontAwesomeIcon
                    className='reviews-star-icon'
                    icon={faStar}
                />
                <h2 id='reviews-avg-rating'>{avgStarRating}</h2>
                <span className='spot-page-header-divider'>·</span>
                <p id='reviews-num-reviews'>{numReviews} reviews</p>
            </div>

            <div className='reviews-container'>
                {reviews &&
                    reviews.length &&
                    reviews.map((review) => {
                        const createdAt = new Date(
                            review.createdAt
                        ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        });

                        return (
                            <ReviewItem
                                key={review.id}
                                review={review}
                            />
                        );

                        return (
                            <div
                                key={review.id}
                                className='review-container'
                            >
                                <div className='review-header'>
                                    <FontAwesomeIcon
                                        className='review-star-icon'
                                        icon={faStar}
                                    />
                                    <p id='review-rating'>
                                        {review.starRating}
                                    </p>
                                    <span className='review-header-divider'>
                                        ·
                                    </span>
                                    <p id='review-date'>{createdAt}</p>

                                    <p id='review-user'>
                                        {review.User.firstName}
                                    </p>

                                    <p id='review-body'>{review.body}</p>

                                    <div className='review-images-container'>
                                        {review.ReviewImages.map((image) => (
                                            <img
                                                key={image.id}
                                                className='review-image'
                                                src={`/images/${image.url}`}
                                                alt={`${review.User.firstName}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SpotPageReviews;
