import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBooking } from './bookingSlice';

const BookingForm = ({ showGenericPopup, hideGenericPopup, spot }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const dispatch = useDispatch();

    const handleBooking = async (e) => {
        e.preventDefault();

        const result = await dispatch(
            createBooking({ spotId: spot.id, startDate, endDate })
        );

        if (result.payload) {
            showGenericPopup('Success!', 'Thanks for booking!');
        } else {
            showGenericPopup('Error', result.error.message || 'Unknown Error');
        }
    };

    return (
        <form onSubmit={handleBooking}>
            <input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <button type='submit'>Book</button>
        </form>
    );
};

export default BookingForm;
