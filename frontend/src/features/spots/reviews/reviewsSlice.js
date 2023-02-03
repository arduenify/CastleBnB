import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetch } from '../../../app/csrf';

const initialState = {
    reviews: [],
    error: null,
};

export const editReviewById = createAsyncThunk(
    'reviews/editReviewById',
    async ({ review }, thunkAPI) => {
        const response = await csrfFetch(`/api/reviews/${review.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });

        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return thunkAPI.rejectWithValue(responseJson);
    }
);

export const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
});

export const { setReviews, setError } = reviewsSlice.actions;

export default reviewsSlice.reducer;
