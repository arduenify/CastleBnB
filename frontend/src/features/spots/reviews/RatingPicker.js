import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import './RatingPicker.css';

const RatingPicker = ({ rating, setRating }) => {
    const ratingChanged = (newRating) => {
        setRating(newRating);
    };

    return (
        <div className='rating-picker-container'>
            {[1, 2, 3, 4, 5].map((num) => (
                <FontAwesomeIcon
                    className='rating-picker-star'
                    icon={faStar}
                    color={
                        rating >= num
                            ? 'var(--colors-accent)'
                            : 'var(--colors-gray)'
                    }
                    onClick={() => ratingChanged(num)}
                />
            ))}
        </div>
    );
};

export default RatingPicker;
