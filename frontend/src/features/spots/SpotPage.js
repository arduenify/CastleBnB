import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { getSpotById } from './spotsSlice';
import { currentUserOwnsSpot } from '../../common/helpers';

import EditSpot from './EditSpot';
import SpotPageReviews from './reviews/SpotPageReviews';

import './SpotPage.css';

const SpotPage = ({ showGenericPopup, hideGenericPopup }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const { spotId } = useParams();
    const [spot, setSpot] = useState(null);
    const [isSpotOwner, setIsSpotOwner] = useState(false);

    useEffect(() => {
        dispatch(getSpotById(spotId)).then((spot) => {
            setSpot(spot.payload);
            setIsSpotOwner(currentUserOwnsSpot(currentUser, spot.payload));
        });
    }, [dispatch, spotId]);

    useEffect(() => {
        if (spot) {
            setIsSpotOwner(currentUserOwnsSpot(currentUser, spot));
        }
    }, [currentUser]);

    if (!spot) return null;

    const onSpotEdit = (updatedSpot) => {
        setSpot(updatedSpot);
        hideGenericPopup();
    };

    const editSpotBtnClicked = () => {
        const header = 'Edit Spot';
        const content = (
            <EditSpot
                spot={spot}
                onEdit={onSpotEdit}
            />
        );

        showGenericPopup(header, content);
    };

    return (
        <div className='spot-page-container'>
            <div className='spot-page-header'>
                <div className='spot-page-header-top-row'>
                    <h1 id='spot-page-header-title'>{spot.name}</h1>
                </div>

                <div className='spot-page-header-row'>
                    <FontAwesomeIcon
                        className='spot-page-star-icon'
                        icon={faStar}
                    />
                    <p id='spot-avg-rating'>{spot.avgStarRating}</p>
                    <span className='spot-page-header-divider'>·</span>
                    <p id='spot-num-reviews'>{spot.numReviews} reviews</p>
                    <span className='spot-page-header-divider'>·</span>
                    <p id='spot-location'>
                        {spot.city}, {spot.state}, {spot.country}
                    </p>
                </div>

                {isSpotOwner && (
                    <>
                        <p id='spot-page-edit-disclaimer'>
                            Hi, {currentUser?.firstName}! As the owner of this
                            spot, you can make changes by
                            <span>
                                <button
                                    id='spot-page-edit-btn'
                                    onClick={editSpotBtnClicked}
                                >
                                    clicking here.
                                </button>
                            </span>
                        </p>
                    </>
                )}

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
