import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetchPost, csrfFetch } from '../../services/csrf';

const initialState = {
    bookings: {},
};

export const getAllBookings = createAsyncThunk(
    'bookings/getAllBookings',
    async (_, { rejectWithValue }) => {
        const response = await csrfFetch('/api/users/current/bookings');
        const responseJson = await response.json();

        if (response.ok) {
            // normalize bookings into a dictionary
            const bookingObjs = {};
            for (const booking of responseJson.Bookings) {
                bookingObjs[booking.id] = booking;
            }

            return bookingObjs;
        }

        return rejectWithValue(responseJson);
    }
);

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (booking, { rejectWithValue }) => {
        const response = await csrfFetchPost('/api/bookings', booking);

        if (response.ok) {
            return;
        }

        const responseJson = await response.json();
        return rejectWithValue(responseJson);
    }
);

export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        addBooking: (state, action) => {
            state.bookings[action.payload.id] = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllBookings.fulfilled, (state, action) => {
            state.bookings = action.payload;
        });
    },
});

export const { addBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
