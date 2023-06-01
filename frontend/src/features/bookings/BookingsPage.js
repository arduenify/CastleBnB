import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllBookings } from './bookingSlice';
import { showGenericPopup } from '../../common/components/PopupModal/PopupModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './BookingsPage.css';

const BookingsPage = ({ showGenericPopup, hideGenericPopup }) => {
    const userId = useSelector((state) => state.user.currentUser?.id);
    const bookings = useSelector((state) => state.booking.bookings);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) return;

        dispatch(getAllBookings());
    }, [getAllBookings, userId]);

    if (!userId) return null;

    const handleModifyBookingClicked = () => {
        const showDeleteBookingPopup = () => {
            const deleteBookingPopupContent = (
                <div className='delete-spot-popup-container'>
                    <p className='delete-spot-popup-text'>
                        Are you sure you want to cancel this booking?
                    </p>
                    <div className='delete-spot-popup-btns-container'>
                        <button
                            className='delete-spot-popup-btn delete-btn'
                            onClick={onBookingDelete}
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

            showGenericPopup('Cancel Booking', deleteBookingPopupContent);
        };

        const showModifyBookingPopup = () => {
            console.log('TODO');
        };

        const showBookingManager = (
            <div className='spot-manager-container'>
                <h2>What would you like to do?</h2>
                <div className='spot-manager-container-row'>
                    <button
                        className='edit-or-delete-btn choose-btn'
                        onClick={showModifyBookingPopup}
                    >
                        Update my booking
                    </button>
                    <button
                        className='edit-or-delete-btn delete-btn'
                        onClick={showDeleteBookingPopup}
                    >
                        <span>
                            <FontAwesomeIcon
                                id='delete-btn-icon'
                                icon={faTrash}
                            />
                        </span>
                        Cancel my booking
                    </button>
                </div>
            </div>
        );

        showGenericPopup('Booking', showBookingManager);
    };

    const onBookingDelete = () => {
        console.log('TODO');
    };

    const showModifyBookingPopup = () => {
        const modifyBookingPopupHeader = 'Modify Booking';
    };

    return (
        <div className='bookings-page-container'>
            <h1>Bookings</h1>
            {Object.values(bookings).map((booking) => {
                const startDate = new Date(booking.startDate);
                const endDate = new Date(booking.endDate);
                const { id, Spot } = booking;
                const { previewImage, name } = Spot;

                const previewImageUrl = previewImage.includes('http')
                    ? previewImage
                    : `/images/${previewImage}`;

                return (
                    <div
                        className='booking-card'
                        key={id}
                    >
                        <img
                            src={previewImageUrl}
                            alt={name}
                        />
                        <h2>{name}</h2>
                        <p>
                            {startDate.toDateString()} -{' '}
                            {endDate.toDateString()}
                        </p>
                        <p
                            onClick={handleModifyBookingClicked}
                            className='subtext'
                        >
                            Make changes to your reservation here.
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingsPage;
