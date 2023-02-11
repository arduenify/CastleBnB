import { useDispatch } from 'react-redux';

import { deleteImageFromReview } from '../reviewsSlice';
import { getSpotReviewsById } from '../../spotsSlice';

import ViewImage from '../../../../common/components/PopupImage/ViewImage';

import './ViewReviewImage.css';

const ViewReviewImage = ({
    imageUrl,
    reviewId,
    imageId,
    hideGenericPopup,
    isReviewOwner,
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
        <ViewImage
            imageUrl={imageUrl}
            onClick={deleteReviewImageBtnClicked}
            deleteBtnText='Delete review image'
            hasDeletePrivileges={isReviewOwner}
        />
    );
};

export default ViewReviewImage;
