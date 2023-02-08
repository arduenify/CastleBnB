import ReviewImage from './ReviewImage';
import './ReviewImagesContainer.css';

const ReviewImagesContainer = ({
    images,
    setReviewImages,
    user,
    showGenericPopup,
    hideGenericPopup,
    reviewId,
    setReviews,
    spotId,
}) => {
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
                        user={user}
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
