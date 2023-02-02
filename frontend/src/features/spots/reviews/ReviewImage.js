import './ReviewImage.css';

const ReviewImage = ({ image, user }) => {
    return (
        <img
            key={image.id}
            className='review-image'
            src={`/images/${image.url}`}
            alt={`${user.firstName}`}
        />
    );
};

export default ReviewImage;
