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

    useEffect(() => {
        console.log('Spot changed to:', spot);
    }, [spot]);

    if (!spot) return null;

    // Spot object format
    // {
    // "id": 1,
    // "ownerId": 1,
    // "address": "Ochre Point Ave",
    // "city": "Newport",
    // "state": "RI",
    // "country": "USA",
    // "lat": 41.282558,
    // "lng": -71.175619,
    // "name": "Ochre Court",
    // "description": "Beautiful, châteauesque, and the second largest mansion in Newport, Ochre court is a must see for any history buff. Built in 1892 at a cost of $4.5 million dollars, the mansion was designed by architect Richard Morris Hunt. ",
    // "price": 4906,
    // "createdAt": "2023-02-01 08:35:42",
    // "updatedAt": "2023-02-01 08:35:42",
    // "numReviews": 2,
    // "avgStarRating": 5,
    // "SpotImages": [
    //     {
    //         "id": 1,
    //         "url": "ochre_court/preview.jpg",
    //         "preview": true
    //     },
    //     {
    //         "id": 2,
    //         "url": "ochre_court/inside.jpg",
    //         "preview": false
    //     }
    // ],
    // "Owner": {
    //     "id": 1,
    //     "firstName": "Adam",
    //     "lastName": "Scoggins"
    // }

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
