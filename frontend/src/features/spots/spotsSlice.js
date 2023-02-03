import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetch } from '../../app/csrf';

const initialState = {
    spots: [],
    currentSpotReviews: [],
    currentSpot: null,
};

/**
 * Used to add a review to a spot by spot id.
 * @param {number} spotId - The id of the spot.
 * @param {object} review - The review object.
 * @returns {object} - The review object.
 *
 * @example
 * const response = await dispatch(addReviewToSpotById(1, review));
 */

// Create a Review for a Spot based on the Spot's id
// Create and return a new review for a spot specified by id.

// Require Authentication: true

// Request

// Method: POST

// URL: /spots/:spotId/reviews

// Headers:

// Content-Type: application/json
// Body:

// {
//     "review": "This was an awesome spot!",
//     "stars": 5
// }
// Successful Response

// Status Code: 201

// Headers:

// Content-Type: application/json
// Body:

// {
//     "id": 1,
//     "userId": 1,
//     "spotId": 1,
//     "review": "This was an awesome spot!",
//     "stars": 5,
//     "createdAt": "2021-11-19 20:39:36",
//     "updatedAt": "2021-11-19 20:39:36"
// }
// Error Response: Body validation errors

// Status Code: 400

// Headers:

// Content-Type: application/json
// Body:

// {
//     "message": "Validation error",
//     "statusCode": 400,
//     "errors": [
//         "Review text is required",
//         "Stars must be an integer from 1 to 5"
//     ]
// }
// Error response: Couldn't find a Spot with the specified id

// Status Code: 404

// Headers:

// Content-Type: application/json
// Body:

// {
//     "message": "Spot couldn't be found",
//     "statusCode": 404
// }
// Error response: Review from the current user already exists for the Spot

// Status Code: 403

// Headers:

// Content-Type: application/json
// Body:

// {
//     "message": "User already has a review for this spot",
//     "statusCode": 403
// }
export const addReviewToSpotById = createAsyncThunk(
    'spots/addReviewToSpotById',
    async ({ spotId, review }, { dispatch, rejectWithValue }) => {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });

        const responseJson = await response.json();

        if (response.ok) {
            const spotReviews = await (
                await dispatch(getSpotReviewsById(spotId))
            ).payload.Reviews;

            console.log('SPOT REVIEWS!!!!!!!!!!!!!', spotReviews);

            return spotReviews;
        }

        return rejectWithValue(responseJson);
    }
);

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

/**
 * Used to get all the reviews of a spot by spot id.
 * @param {number} id - The id of the spot.
 * @returns {Array} - An array of the reviews.
 *
 * @example
 * const reviews = await dispatch(getSpotReviews(1));
 */
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
