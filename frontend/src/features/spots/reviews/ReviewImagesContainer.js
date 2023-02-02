import ReviewImage from './ReviewImage';
import './ReviewImagesContainer.css';

const ReviewImagesContainer = ({ images, user }) => {
    return (
        <div className='review-images-container'>
            {images.map((image) => {
                return (
                    <ReviewImage
                        key={image.id}
                        image={image}
                        user={user}
                    />
                );
            })}
        </div>
    );
};

export default ReviewImagesContainer;
