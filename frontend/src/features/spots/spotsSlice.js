import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    csrfFetchPost,
    csrfFetch,
    csrfFetchPut,
    csrfFetchDelete,
} from '../../app/csrf';

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

export const editSpotById = createAsyncThunk(
    'spots/editSpotById',
    async ({ spotId, payload: spot }, { rejectWithValue }) => {
        const response = await csrfFetchPut(`/api/spots/${spotId}`, spot);
        const responseJson = await response.json();

        if (response.ok) {
            const updatedSpot = {
                ...spot,
                ...responseJson,
            };

            return updatedSpot;
        }

        return rejectWithValue(responseJson);
    }
);

export const deleteSpotById = createAsyncThunk(
    'spots/deleteSpotById',
    async (id, { rejectWithValue }) => {
        const response = await csrfFetchDelete(`/api/spots/${id}`);
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
            })

            .addCase(editSpotById.fulfilled, (state, action) => {
                state.currentSpot = action.payload;
            })

            .addCase(deleteSpotById.fulfilled, (state, action) => {
                state.currentSpot = null;
            });
    },
});

export const selectSpotOwnerId = (spot) => {
    return spot?.Owner?.id;
};

export default spotsSlice.reducer;
