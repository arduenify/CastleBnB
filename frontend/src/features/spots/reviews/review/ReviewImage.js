import { useEffect, useState } from 'react';
import ViewReviewImage from './ViewReviewImage';

import './ReviewImage.css';

const ReviewImage = ({
    image,
    showGenericPopup,
    hideGenericPopup,
    reviewId,
    isReviewOwner,
    spotId,
    setReviews,
    deleteReviewImage,
}) => {
    const [validImage, setValidImage] = useState(false);
    const [imageUrl, setImageUrl] = useState(image.url);

    const reviewImageClicked = () => {
        const header = 'Review image';

        const content = (
            <ViewReviewImage
                imageUrl={imageUrl}
                reviewId={reviewId}
                imageId={image.id}
                spotId={spotId}
                setReviews={setReviews}
                hideGenericPopup={hideGenericPopup}
                isReviewOwner={isReviewOwner}
            />
        );

        showGenericPopup(header, content, 'review-image-popup');
    };

    useEffect(() => {
        const fetchImage = async () => {
            const res = await fetch(image.url);

            if (res.ok) {
                return setValidImage(true);
            } else {
                const res = await fetch(`/images/${image.url}`);

                if (res.ok) {
                    setImageUrl(`/images/${image.url}`);
                    return setValidImage(true);
                }
            }

            deleteReviewImage(image.id);
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
            src={imageUrl}
            alt={`review`}
            onError={(e) => {
                e.target.onerror = null;
            }}
            onClick={reviewImageClicked}
        />
    );
};

export default ReviewImage;
