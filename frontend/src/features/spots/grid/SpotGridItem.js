import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import './SpotGridItem.css';

const SpotGridItem = ({ spot }) => {
    const { city, state, country, description, avgRating, previewImage } = spot;

    const spotLocation = () => {
        let location = '';

        if (city !== 'N/A') location += `${city}, `;
        if (state !== 'N/A') location += `${state}, `;
        if (country) location += `${country}`;

        return location;
    };

    return (
        <Link
            className='spot-container'
            to={`/spots/${spot.id}`}
        >
            <div className='spot-image-container'>
                <img
                    className='spot-image'
                    src={`/images/${previewImage}`}
                    alt='Spot Preview'
                />
            </div>

            <div className='spot-info-container'>
                <div className='spot-info'>
                    <div className='spot-name-rating'>
                        <h2 className='spot-name'>{spotLocation()}</h2>
                        <div className='spot-rating-container'>
                            <FontAwesomeIcon
                                className='spot-rating-icon'
                                icon={faStar}
                            />
                            <p className='spot-rating-text'>{avgRating}</p>
                        </div>
                    </div>
                    <p className='spot-description'>{description}</p>
                </div>
            </div>
        </Link>
    );
};

export default SpotGridItem;