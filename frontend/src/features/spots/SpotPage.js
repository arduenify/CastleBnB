import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { getSpotById } from './spotsSlice';

import './SpotPage.css';
import SpotPageReviews from './reviews/SpotPageReviews';

const SpotPage = ({ showGenericPopup, hideGenericPopup }) => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const [spot, setSpot] = useState(null);

    useEffect(() => {
        dispatch(getSpotById(spotId)).then((spot) => setSpot(spot.payload));
    }, [dispatch, spotId]);

    if (!spot) return null;

    return (
        <div className='spot-page-container'>
            <div className='spot-page-header'>
                <h1 id='spot-page-header-title'>{spot.name}</h1>
                <div className='spot-page-header-row'>
                    <FontAwesomeIcon
                        className='spot-page-star-icon'
                        icon={faStar}
                    />
                    <p id='spot-avg-rating'>{spot.avgStarRating}</p>
                    <span className='spot-page-heade-rdivider'>·</span>
                    <p id='spot-num-reviews'>{spot.numReviews} reviews</p>
                    <span className='spot-page-header-divider'>·</span>
                    <p id='spot-location'>
                        {spot.city}, {spot.state}, {spot.country}
                    </p>
                </div>

                <div className='spot-page-images-container'>
                    {spot.SpotImages.map((image) => (
                        <img
                            key={image.id}
                            className='spot-page-image'
                            src={`/images/${image.url}`}
                            alt={`${spot.name}`}
                        />
                    ))}
                </div>

                <div className='spot-page-description-container'>
                    <h2 id='spot-page-owner-header'>
                        Hosted by {spot.Owner.firstName}
                    </h2>
                    <p id='spot-page-description'>{spot.description}</p>
                </div>
            </div>

            <hr></hr>
            <SpotPageReviews
                showGenericPopup={showGenericPopup}
                hideGenericPopup={hideGenericPopup}
                spotId={spot.id}
                avgStarRating={spot.avgStarRating}
                numReviews={spot.numReviews}
            />
        </div>
    );
};

export default SpotPage;
