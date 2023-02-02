import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import './ReviewItem.css';

const ReviewItem = ({ review }) => {
    const {
        User,
        ReviewImages,
        createdAt,
        id,
        review: reviewText,
        spotId,
        stars,
        userId,
    } = review;

    const reviewDate = new Date(createdAt).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className='review-container'>
            <div className='review-header'>
                <FontAwesomeIcon
                    className='review-star-icon'
                    icon={faStar}
                />
                <p id='review-rating'>{stars}</p>
                <span className='review-header-divider'>·</span>
                <div id='review-user-date-container'>
                    <p id='review-user'>{User.firstName}</p>
                    <p id='review-date'>{reviewDate}</p>
                </div>
            </div>

            <p id='review-body'>{reviewText}</p>

            <div className='review-images-container'>
                {review.ReviewImages.map((image) => (
                    <img
                        key={image.id}
                        className='review-image'
                        src={`/images/${image.url}`}
                        alt={`${User.firstName}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewItem;
