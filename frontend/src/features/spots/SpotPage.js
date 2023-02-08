import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getSpotById, deleteSpotById, deleteSpotImageById } from './spotsSlice';
import { currentUserOwnsSpot } from '../../common/helpers';

import EditSpot from './EditSpot';
import SpotPageReviews from './reviews/SpotPageReviews';

import './SpotPage.css';
import ViewSpotImage from './ViewSpotImage';

const SpotPage = ({ showGenericPopup, hideGenericPopup }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const { spotId } = useParams();
    const [spot, setSpot] = useState(null);
    const [isSpotOwner, setIsSpotOwner] = useState(false);
    const spotImages = useSelector(
        (state) => state.spot.currentSpot?.SpotImages
    );

    useEffect(() => {
        dispatch(getSpotById(spotId)).then((spot) => {
            setSpot(spot.payload);
            setIsSpotOwner(currentUserOwnsSpot(currentUser, spot.payload));
        });
    }, [dispatch, spotId, currentUser]);

    useEffect(() => {
        if (spot) {
            setIsSpotOwner(currentUserOwnsSpot(currentUser, spot));
        }
    }, [currentUser, spot]);

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

    const spotImageClicked = (spotImageId, spotImageUrl) => {
        const header = 'Spot image';

        const content = (
            <ViewSpotImage
                imageId={spotImageId}
                spotId={spotId}
                hideGenericPopup={hideGenericPopup}
                imageUrl={spotImageUrl}
                isSpotOwner={isSpotOwner}
            />
        );

        showGenericPopup(header, content, 'spot-image-popup');
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
                            className='delete-spot-popup-btn delete-btn'
                            onClick={onSpotDelete}
                        >
                            <span>
                                <FontAwesomeIcon
                                    id='delete-btn-icon'
                                    icon={faTrash}
                                />
                            </span>
                            Yes, I am sure!
                        </button>
                    </div>
                </div>
            );

            showGenericPopup(deleteSpotPopupHeader, deleteSpotPopupContent);
        };

        const showSpotManager = (
            <div className='spot-manager-container'>
                <h2>Spot</h2>
                <div className='spot-manager-container-row'>
                    <button
                        className='edit-or-delete-btn choose-btn'
                        onClick={showEditSpotPopup}
                    >
                        Update the details
                    </button>
                    <button
                        className='edit-or-delete-btn delete-btn'
                        onClick={showDeleteSpotPopup}
                    >
                        <span>
                            <FontAwesomeIcon
                                id='delete-btn-icon'
                                icon={faTrash}
                            />
                        </span>
                        Delete it
                    </button>
                </div>

                <hr className='spot-manager-container-hr'></hr>
                <h2 id='spot-image-header'>Spot Images</h2>
                <div className='spot-manager-container-row'>
                    <button
                        className='edit-or-delete-btn choose-btn'
                        // onClick={addSpotImage}
                    >
                        Add an image
                    </button>
                </div>

                <div className='spot-manager-container-row'>
                    <p id='spot-manager-delete-image-disclaimer'>
                        To delete an existing Spot Image, close this window and
                        click on the image you'd like to delete.
                    </p>
                </div>
            </div>
        );

        showGenericPopup('What would you like to do?', showSpotManager);
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
                    {spotImages.map((image) => {
                        const imageUrl = image.url.includes('http')
                            ? image.url
                            : `/images/${image.url}`;

                        return (
                            <img
                                key={image.id}
                                src={imageUrl}
                                alt={image.description}
                                className='spot-page-image'
                                onClick={() =>
                                    spotImageClicked(image.id, imageUrl)
                                }
                            />
                        );
                    })}
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
                isSpotOwner={isSpotOwner}
                spotId={spot.id}
                avgStarRating={spot.avgStarRating}
                numReviews={spot.numReviews}
            />
        </div>
    );
};

export default SpotPage;
