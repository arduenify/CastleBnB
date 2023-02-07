import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { getSpotById, deleteSpotById } from './spotsSlice';
import { currentUserOwnsSpot } from '../../common/helpers';

import EditSpot from './EditSpot';
import SpotPageReviews from './reviews/SpotPageReviews';

import './SpotPage.css';

const SpotPage = ({ showGenericPopup, hideGenericPopup }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const onSpotDelete = async () => {
        const deleteSpotResponse = await dispatch(deleteSpotById(spotId));

        hideGenericPopup();

        if (deleteSpotResponse.meta.requestStatus === 'rejected') {
            if (deleteSpotResponse.payload.message) {
                return alert(deleteSpotResponse.payload.message);
            }

            return alert('Something went wrong');
        }

        navigate('/');
    };

    const showEditSpotPopup = () => {
        const header = 'Edit Spot';
        const content = (
            <EditSpot
                spot={spot}
                onEdit={onSpotEdit}
            />
        );

        showGenericPopup(header, content, 'edit-spot-popup');
    };

    const editSpotBtnClicked = () => {
        const showDeleteSpotPopup = () => {
            const deleteSpotPopupHeader = 'Delete Spot';

            const deleteSpotPopupContent = (
                <div className='delete-spot-popup-container'>
                    <p className='delete-spot-popup-text'>
                        Are you sure you want to delete this spot?
                    </p>
                    <div className='delete-spot-popup-btns-container'>
                        <button
                            className='delete-spot-popup-btn'
                            onClick={hideGenericPopup}
                        >
                            Cancel
                        </button>
                        <button
                            className='delete-spot-popup-btn'
                            onClick={onSpotDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            );

            showGenericPopup(deleteSpotPopupHeader, deleteSpotPopupContent);
        };

        const showChooseEditOrDelete = (
            <div className='edit-or-delete-container'>
                <button
                    className='edit-or-delete-btn'
                    onClick={showEditSpotPopup}
                >
                    Edit
                </button>
                <button
                    className='edit-or-delete-btn'
                    onClick={showDeleteSpotPopup}
                >
                    Delete
                </button>
            </div>
        );

        showGenericPopup('Edit or Delete', showChooseEditOrDelete);
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
                            spot, you can make changes or delete this spot by
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
