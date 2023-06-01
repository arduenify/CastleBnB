import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllBookings } from './bookingSlice';

const BookingsPage = () => {
    const userId = useSelector((state) => state.user.currentUser?.id);
    const bookings = useSelector((state) => state.booking.bookings);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) return;

        dispatch(getAllBookings());
    }, [getAllBookings, userId]);

    if (!userId) return null;

    return (
        <div className='bookings-page-container'>
            <h1>Bookings Page</h1>
        </div>
    );
};

export default BookingsPage;
