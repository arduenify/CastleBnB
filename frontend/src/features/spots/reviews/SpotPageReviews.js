import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { getSpotReviewsById } from '../spotsSlice';
import ReviewItem from './review/ReviewItem';
import AddReview from './review/addReview/AddReview';

import './SpotPageReviews.css';

const SpotPageReviews = ({
    spotId,
    avgStarRating,
    setAvgStarRating,
    numReviews,
    setNumReviews,
    showGenericPopup,
    hideGenericPopup,
    isSpotOwner,
}) => {
    const [reviews, setReviews] = useState([]);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        dispatch(getSpotReviewsById(spotId)).then((reviews) => {
            setReviews(reviews.payload.Reviews);
        });
    }, [dispatch, spotId]);

    useEffect(() => {
        if (reviews.length) {
            const totalStars = reviews.reduce(
                (acc, review) => acc + review.stars,
                0
            );

            const avgStars = totalStars / reviews.length;

            setAvgStarRating(avgStars.toFixed(2));
            setNumReviews(reviews.length);
        } else {
            setAvgStarRating(0);
            setNumReviews(0);
        }
    }, [reviews, setAvgStarRating, setNumReviews]);

    const addReviewBtnClicked = () => {
        const header = 'Add a review';
        const content = (
            <AddReview
                spotId={spotId}
                setReviews={setReviews}
                hideGenericPopup={hideGenericPopup}
                showGenericPopup={showGenericPopup}
            />
        );

        showGenericPopup(header, content);
    };

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

                {currentUser && (
                    <button
                        id='add-review-button'
                        onClick={addReviewBtnClicked}
                    >
                        Add a review
                    </button>
                )}
            </div>

            <div className='reviews-container'>
                {reviews &&
                    reviews.length > 0 &&
                    reviews.map((review) => {
                        return (
                            <ReviewItem
                                key={review.id}
                                spotId={spotId}
                                review={review}
                                isSpotOwner={isSpotOwner}
                                setReviews={setReviews}
                                showGenericPopup={showGenericPopup}
                                hideGenericPopup={hideGenericPopup}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default SpotPageReviews;
