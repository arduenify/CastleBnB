import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    csrfFetchPost,
    csrfFetch,
    csrfFetchPut,
    csrfFetchDelete,
} from '../../services/csrf';

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

export const createSpot = createAsyncThunk(
    'spots/createSpot',
    async (spot, { rejectWithValue }) => {
        const response = await csrfFetchPost('/api/spots', spot);
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

export const deleteSpotImageById = createAsyncThunk(
    'spots/deleteSpotImageById',
    async ({ spotId, imageId }, { rejectWithValue, fulfillWithValue }) => {
        const response = await csrfFetchDelete(
            `/api/spots/${spotId}/images/${imageId}`
        );

        const responseJson = await response.json();

        if (response.ok) {
            return fulfillWithValue({ spotId, imageId });
        }

        return rejectWithValue(responseJson);
    }
);

export const addImageToSpot = createAsyncThunk(
    'spots/addImageToSpot',
    async (
        { spotId, imageUrl, isPreviewImage },
        { rejectWithValue, fulfillWithValue }
    ) => {
        const response = await csrfFetchPost(`/api/spots/${spotId}/images`, {
            url: imageUrl,
            preview: isPreviewImage,
        });

        const responseJson = await response.json();

        if (response.ok) {
            return fulfillWithValue({ spotId, ...responseJson });
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

            .addCase(createSpot.fulfilled, (state, action) => {
                state.spots.push(action.payload);
            })

            .addCase(editSpotById.fulfilled, (state, action) => {
                state.currentSpot = action.payload;
            })

            .addCase(deleteSpotById.fulfilled, (state, action) => {
                state.currentSpot = null;
            })

            .addCase(addImageToSpot.fulfilled, (state, action) => {
                const spot = state.spots.find(
                    (s) => parseInt(s.id) === parseInt(action.payload.spotId)
                );

                spot.SpotImages.push(action.payload);
            });

        // .addCase(deleteSpotImageById.fulfilled, (state, action) => {
        //     const { spotId, imageId } = action.payload;

        //     state.currentSpot.SpotImages =
        //         state.currentSpot.SpotImages.filter(
        //             (image) => image.id !== imageId
        //         );
        // });
    },
});

export const selectSpotOwnerId = (spot) => {
    return spot?.Owner?.id;
};

export const searchSpots = (spots, search) => {
    if (!search) return spots;

    return spots.filter((spot) => {
        const spotName = spot.name.toLowerCase();
        // const spotDescription = spot.description.toLowerCase();
        const spotAddress = spot.address.toLowerCase();
        const spotCity = spot.city.toLowerCase();
        const spotState = spot.state.toLowerCase();
        const spotCountry = spot.country.toLowerCase();

        const searchLower = search.toLowerCase();

        return (
            spotName.includes(searchLower) ||
            // spotDescription.includes(searchLower) ||
            spotAddress.includes(searchLower) ||
            spotCity.includes(searchLower) ||
            spotState.includes(searchLower) ||
            spotCountry.includes(searchLower)
        );
    });
};

export default spotsSlice.reducer;
