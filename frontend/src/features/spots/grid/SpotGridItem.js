import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import './SpotGridItem.css';

const SpotGridItem = ({ spot }) => {
    const { city, state, country, description, avgRating } = spot;
    let { previewImage } = spot;

    const spotLocation = () => {
        let location = '';

        if (city !== 'N/A') location += `${city}, `;
        if (state !== 'N/A') location += `${state}, `;
        if (country) location += `${country}`;

        return location;
    };

    if (!previewImage) previewImage = 'default-spot-image.png';

    const previewImageUrl = previewImage.includes('http')
        ? previewImage
        : `/images/${previewImage}`;

    return (
        <Link
            className='spot-container'
            to={`/spots/${spot.id}`}
        >
            <div className='spot-image-container'>
                <img
                    className='spot-image'
                    src={previewImageUrl}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-spot-image.png';
                    }}
                    alt='Spot Preview'
                />
            </div>

            <div className='spot-info-container full'>
                <div className='spot-info'>
                    <div className='spot-name-rating'>
                        <h2 className='spot-name'>{spotLocation()}</h2>
                        <div className='spot-rating-container'>
                            <FontAwesomeIcon
                                className='spot-rating-icon'
                                icon={faStar}
                                style={
                                    avgRating
                                        ? { color: '#f5c518' }
                                        : {
                                              color: '#d3d3d3',
                                          }
                                }
                            />
                            <p className='spot-rating-text'>
                                {avgRating || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <p className='spot-description'>{description}</p>
                    <div className='popup-description-container'>
                        <p className='popup-description-text'>{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SpotGridItem;
