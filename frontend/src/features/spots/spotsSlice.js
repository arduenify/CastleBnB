import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetchPost, csrfFetch } from '../../app/csrf';

const initialState = {
    spots: [],
    currentSpotReviews: [],
    currentSpot: null,
};

export const addReviewToSpotById = createAsyncThunk(
    'spots/addReviewToSpotById',
    async ({ spotId, review }, { dispatch, rejectWithValue }) => {
        const response = await csrfFetchPost(
            `/api/spots/${spotId}/reviews`,
            review
        );

        if (response.ok) {
            const spotReviews = await (
                await dispatch(getSpotReviewsById(spotId))
            ).payload.Reviews;

            return spotReviews;
        }

        const responseJson = await response.json();
        return rejectWithValue(responseJson);
    }
);

export const getAllSpots = createAsyncThunk(
    'spots/getAllSpots',
    async (_, { rejectWithValue }) => {
        const response = await csrfFetch('/api/spots');
        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return rejectWithValue(responseJson);
    }
);

export const getSpotById = createAsyncThunk(
    'spots/getSpotById',
    async (id, { rejectWithValue }) => {
        const response = await csrfFetch(`/api/spots/${id}`);
        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return rejectWithValue(responseJson);
    }
);

export const getSpotReviewsById = createAsyncThunk(
    'spots/getSpotReviews',
    async (id, { rejectWithValue }) => {
        const response = await csrfFetch(`/api/spots/${id}/reviews`);
        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return rejectWithValue(responseJson);
    }
);

export const spotsSlice = createSlice({
    name: 'spots',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSpots.fulfilled, (state, action) => {
                state.spots = action.payload.Spots;
            })

            .addCase(getSpotById.fulfilled, (state, action) => {
                state.currentSpot = action.payload;
            })

            .addCase(getSpotReviewsById.fulfilled, (state, action) => {
                state.currentSpotReviews = action.payload.Reviews;
            })

            .addCase(addReviewToSpotById.fulfilled, (state, action) => {
                state.currentSpotReviews = action.payload.Reviews;
            });
    },
});

export default spotsSlice.reducer;
