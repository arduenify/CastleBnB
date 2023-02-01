import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetch } from '../../app/csrf';

const initialState = {
    spots: [],
};

/**
 * Used to get all of the spots.
 * @returns {Array} - An array of the spots.
 *
 * @example
 * const spots = await dispatch(getAllSpots());
 */
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

/**
 * Used to get a single spot by id.
 * @param {number} id - The id of the spot.
 * @returns {object} - The spot object.
 *
 * @example
 * const spot = await dispatch(getSpotById(1));
 */
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
            });
    },
});

export default spotsSlice.reducer;
