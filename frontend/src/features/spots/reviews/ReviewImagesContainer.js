import ReviewImage from './ReviewImage';
import './ReviewImagesContainer.css';

const ReviewImagesContainer = ({
    images,
    user,
    showGenericPopup,
    hideGenericPopup,
    reviewId,
    setReviews,
    spotId,
}) => {
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
                    />
                );
            })}
        </div>
    );
};

export default ReviewImagesContainer;
