import { useEffect, useState } from 'react';
import ViewReviewImage from './imagePopup/ViewReviewImage';

import './ReviewImage.css';

const ReviewImage = ({
    image,
    showGenericPopup,
    hideGenericPopup,
    reviewId,
    spotId,
    setReviews,
    deleteReviewImage,
}) => {
    const [validImage, setValidImage] = useState(false);

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

    useEffect(() => {
        const fetchImage = async () => {
            const res = await fetch(image.url);

            if (res.ok) {
                setValidImage(true);
            } else {
                deleteReviewImage(image.id);
            }
        };

        fetchImage();
    }, [image, setValidImage, deleteReviewImage]);

    if (!validImage) {
        return null;
    }

    return (
        <img
            key={image.id}
            className='review-image'
            src={image.url}
            alt={`review`}
            onError={(e) => {
                e.target.onerror = null;
                e.target.display = 'none';
            }}
            onClick={reviewImageClicked}
        />
    );
};

export default ReviewImage;
