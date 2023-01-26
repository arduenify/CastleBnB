import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetch } from '../../app/csrf';

const initialState = {
    currentUser: null,
    loading: false,
    errors: null,
};

/**
 * Used by the LoginFormComponent to log in a user.
 *
 * @param {string} credential - The username or email of the user.
 * @param {string} password - The password of the user.
 * @returns {object} - The user object.
 *
 * @example
 * const payload = {credential: 'username', password: 'password'}
 * const user = await dispatch(login(payload));
 */
export const login = createAsyncThunk(
    'users/login',
    async ({ credential, password }, thunkAPI) => {
        const response = await csrfFetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                credential,
                password,
            }),
        });

        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return thunkAPI.rejectWithValue(responseJson);
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.errors = [];
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;

                if (action.payload.errors) {
                    state.errors = action.payload.errors;
                } else {
                    state.errors = [action.payload.message];
                }
            });
    },
});

export default userSlice.reducer;
