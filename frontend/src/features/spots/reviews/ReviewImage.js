import './ReviewImage.css';

const ReviewImage = ({ image, user }) => {
    const imageUrl = image.url.includes('http')
        ? image.url
        : `/images/${image.url}`;

    return (
        <img
            key={image.id}
            className='review-image'
            src={imageUrl}
            alt={`${user.firstName}`}
        />
    );
};

export default ReviewImage;
