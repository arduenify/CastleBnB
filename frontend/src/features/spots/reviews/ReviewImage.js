import ViewReviewImage from './imagePopup/ViewReviewImage';

import './ReviewImage.css';

const ReviewImage = ({
    image,
    showGenericPopup,
    hideGenericPopup,
    reviewId,
    spotId,
    setReviews,
}) => {
    const reviewImageClicked = () => {
        const header = 'Review image';

        const content = (
            <ViewReviewImage
                imageUrl={image.url}
                reviewId={reviewId}
                imageId={image.id}
                spotId={spotId}
                setReviews={setReviews}
                hideGenericPopup={hideGenericPopup}
            />
        );

        showGenericPopup(header, content, 'review-image-popup');
    };

    return (
        <img
            key={image.id}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default.png';
            }}
            className='review-image'
            src={image.url}
            alt={`review image`}
            onClick={reviewImageClicked}
        />
    );
};

export default ReviewImage;
