import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from 'react-redux';

import { deleteReviewById } from './reviewsSlice';
import { getSpotReviewsById } from '../spotsSlice';

import EditReview from './edit/EditReview';
import ReviewImagesContainer from './ReviewImagesContainer';

import './ReviewItem.css';
import AddReviewImage from './addImage/AddReviewImage';

const ReviewItem = ({
    review,
    setReviews,
    hideGenericPopup,
    showGenericPopup,
}) => {
    const {
        User,
        ReviewImages,
        createdAt,
        // id,
        review: reviewText,
        spotId,
        stars,
        // userId,
    } = review;

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

    const addReviewImageBtnClicked = () => {
        const header = 'Add image to review';
        const content = (
            <AddReviewImage
                reviewId={review.id}
                spotId={spotId}
                hideGenericPopup={hideGenericPopup}
            />
        );

        showGenericPopup(header, content);
    };

    return (
        <div className='review-container'>
            <div className='review-header'>
                <div id='review-user-date-container'>
                    <p id='review-user'>{User?.firstName}</p>
                    <p id='review-date'>{reviewDate}</p>
                </div>

                <div className='review-container-right'>
                    <div className='review-rating-container'>
                        <FontAwesomeIcon
                            className='review-star-icon'
                            icon={faStar}
                        />
                        <p id='review-rating'>{stars}</p>
                    </div>

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
            </div>

            <p id='review-body'>{reviewText}</p>

            {ReviewImages?.length > 0 && (
                <ReviewImagesContainer
                    images={ReviewImages}
                    user={User}
                />
            )}
        </div>
    );
};

export default ReviewItem;
