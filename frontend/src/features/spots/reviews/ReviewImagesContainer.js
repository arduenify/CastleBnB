import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ReviewImage from './ReviewImage';

import './ReviewImagesContainer.css';

const ReviewImagesContainer = ({
    images,
    setReviewImages,
    // isSpotOwner,
    reviewUser,
    showGenericPopup,
    hideGenericPopup,
    reviewId,
    setReviews,
    spotId,
}) => {
    const currentUser = useSelector((state) => state.user.currentUser);

    const [isReviewOwner, setIsReviewOwner] = useState(false);

    useEffect(() => {
        if (currentUser?.id === reviewUser?.id) {
            setIsReviewOwner(true);
        } else {
            setIsReviewOwner(false);
        }
    }, [currentUser, reviewUser]);

    const deleteReviewImage = (imageId) => {
        setReviewImages((prev) => {
            return prev.filter((image) => image.id !== imageId);
        });
    };

    return (
        <div className='review-images-container'>
            {images.map((image) => {
                return (
                    <ReviewImage
                        key={image.id}
                        image={image}
                        isReviewOwner={isReviewOwner}
                        spotId={spotId}
                        showGenericPopup={showGenericPopup}
                        hideGenericPopup={hideGenericPopup}
                        reviewId={reviewId}
                        setReviews={setReviews}
                        deleteReviewImage={deleteReviewImage}
                    />
                );
            })}
        </div>
    );
};

export default ReviewImagesContainer;
