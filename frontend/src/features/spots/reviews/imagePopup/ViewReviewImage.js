import { useDispatch } from 'react-redux';

import { deleteImageFromReview } from '../reviewsSlice';
import { getSpotReviewsById } from '../../spotsSlice';

import './ViewReviewImage.css';

const ViewReviewImage = ({
    imageUrl,
    reviewId,
    imageId,
    hideGenericPopup,
    spotId,
    setReviews,
}) => {
    const dispatch = useDispatch();

    const deleteReviewImageBtnClicked = async () => {
        const response = await dispatch(
            deleteImageFromReview({ reviewId, imageId })
        );

        if (response.meta.requestStatus === 'rejected') {
            alert(response.payload.message);
        } else if (response.meta.requestStatus === 'fulfilled') {
            const reviews = await dispatch(getSpotReviewsById(spotId));
            setReviews(reviews.payload.Reviews);
        }

        hideGenericPopup();
    };

    return (
        <div className='review-image-popup-content'>
            <img
                className='review-image-popup-image'
                src={imageUrl}
                alt='popup image'
            />

            <button
                id='delete-review-image-btn'
                onClick={deleteReviewImageBtnClicked}
            >
                Delete review image
            </button>
        </div>
    );
};

export default ViewReviewImage;
