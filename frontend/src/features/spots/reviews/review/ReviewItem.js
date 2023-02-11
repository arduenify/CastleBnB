import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { deleteReviewById } from '../reviewsSlice';
import { getSpotReviewsById } from '../../spotsSlice';

import AddReviewImage from './addImage/AddReviewImage';
import EditReview from './editReview/EditReview';
import ReviewImagesContainer from './ReviewImagesContainer';

import './ReviewItem.css';

const ReviewItem = ({
    review,
    setReviews,
    hideGenericPopup,
    showGenericPopup,
    isSpotOwner,
}) => {
    const {
        User,
        // ReviewImages,
        createdAt,
        id,
        review: reviewText,
        spotId,
        stars,
        // userId,
    } = review;

    const [reviewImages, setReviewImages] = useState(review?.ReviewImages);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    const reviewDate = new Date(createdAt).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const editReviewBtnClicked = () => {
        const header = 'Edit review';
        const content = (
            <EditReview
                spotId={spotId}
                review={review}
                setReviews={setReviews}
                hideGenericPopup={hideGenericPopup}
            />
        );

        showGenericPopup(header, content);
    };

    const deleteReviewBtnClicked = async () => {
        const result = await dispatch(deleteReviewById(review.id));

        if (result.meta.requestStatus === 'fulfilled') {
            hideGenericPopup();

            const reviews = await dispatch(getSpotReviewsById(spotId));
            setReviews(reviews.payload.Reviews);
        } else if (result.meta.requestStatus === 'rejected') {
            alert(result.payload.message);
        }
    };

    const addReviewImageBtnClicked = async () => {
        const header = 'Add image to review';
        const content = (
            <AddReviewImage
                reviewId={review.id}
                spotId={spotId}
                setReviews={setReviews}
                hideGenericPopup={hideGenericPopup}
            />
        );

        showGenericPopup(header, content);
    };

    useEffect(() => {
        setReviewImages(review?.ReviewImages);
    }, [review]);

    return (
        <div className='review-container'>
            <div className='review-header'>
                <img
                    id='review-user-image'
                    src={User?.profileImageUrl || '/images/default.png'}
                    alt='user'
                />
                <div id='review-user-date-container'>
                    <p id='review-user'>{User?.firstName}</p>
                    <p id='review-date'>{reviewDate}</p>
                </div>

                <div className='review-container-right'></div>
            </div>

            <div className='review-stars-container'>
                {[1, 2, 3, 4, 5].map((num) => (
                    <FontAwesomeIcon
                        key={num}
                        icon={faStar}
                        className='review-star-icon'
                        color={
                            stars >= num
                                ? 'var(--colors-gold)'
                                : 'var(--colors-gray)'
                        }
                    />
                ))}
            </div>

            <p id='review-body'>{reviewText}</p>

            {reviewImages?.length > 0 && (
                <ReviewImagesContainer
                    reviewId={id}
                    images={reviewImages}
                    setReviewImages={setReviewImages}
                    spotId={spotId}
                    setReviews={setReviews}
                    isSpotOwner={isSpotOwner}
                    reviewUser={User}
                    showGenericPopup={showGenericPopup}
                    hideGenericPopup={hideGenericPopup}
                />
            )}

            {currentUser?.id === User?.id && (
                <div className='edit-delete-container'>
                    <button
                        type='button'
                        className='edit-review-btn'
                        onClick={editReviewBtnClicked}
                    >
                        Edit
                    </button>
                    <button
                        type='button'
                        className='delete-review-btn'
                        onClick={deleteReviewBtnClicked}
                    >
                        Delete
                    </button>
                    <button
                        type='button'
                        className='add-review-image-btn'
                        onClick={addReviewImageBtnClicked}
                    >
                        Add image
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
