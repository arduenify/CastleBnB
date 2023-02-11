import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    csrfFetchDelete,
    csrfFetchPost,
    csrfFetchPut,
} from '../../../services/csrf';

const initialState = {
    reviews: [],
    error: null,
};

export const editReviewById = createAsyncThunk(
    'reviews/editReviewById',
    async ({ review }, thunkAPI) => {
        const response = await csrfFetchPut(
            `/api/reviews/${review.id}`,
            review
        );

        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return thunkAPI.rejectWithValue(responseJson);
    }
);

export const deleteReviewById = createAsyncThunk(
    'reviews/deleteReviewById',
    async (reviewId, { rejectWithValue }) => {
        const response = await csrfFetchDelete(`/api/reviews/${reviewId}`);

        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return rejectWithValue(responseJson);
    }
);

export const addImageToReview = createAsyncThunk(
    'reviews/addImageToReview',
    async ({ reviewId, imageUrl }, { rejectWithValue }) => {
        const response = await csrfFetchPost(
            `/api/reviews/${reviewId}/images`,
            {
                url: imageUrl,
            }
        );

        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return rejectWithValue(responseJson);
    }
);

export const deleteImageFromReview = createAsyncThunk(
    'reviews/deleteImageFromReview',
    async ({ reviewId, imageId }, { rejectWithValue }) => {
        const response = await csrfFetchDelete(
            `/api/reviews/${reviewId}/images/${imageId}`
        );

        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return rejectWithValue(responseJson);
    }
);

export const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
});

export const { setReviews, setError } = reviewsSlice.actions;

export default reviewsSlice.reducer;
