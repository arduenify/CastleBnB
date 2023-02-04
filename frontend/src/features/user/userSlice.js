import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetch } from '../../app/csrf';

const initialState = {
    currentUser: null,
    errors: [],
    validationErrors: [],
};

export const signup = createAsyncThunk(
    'users/signup',
    async ({ email, username, password, firstName, lastName }, thunkAPI) => {
        const response = await csrfFetch('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify({
                email,
                username,
                password,
                firstName,
                lastName,
            }),
        });

        const responseJson = await response.json();

        if (response.ok) {
            return responseJson;
        }

        return thunkAPI.rejectWithValue(responseJson);
    }
);

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

export const logout = createAsyncThunk('users/logout', async (_, thunkAPI) => {
    const response = await csrfFetch('/api/users/logout', {
        method: 'DELETE',
    });

    const responseJson = await response.json();

    if (response.ok) {
        return responseJson;
    }

    return thunkAPI.rejectWithValue(responseJson);
});

/**
 * Used by the App component to restore the user session.
 * @returns {object} - The user object.

* @example
 * const user = await dispatch(restoreUser());
 */
export const restoreUser = createAsyncThunk(
    'users/restore',
    async (_, thunkAPI) => {
        const response = await csrfFetch('/api/users/current');
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
    reducers: {
        clearErrors: (state) => {
            state.errors = null;
        },

        clearValidationErrors: (state) => {
            state.validationErrors = null;
        },

        clearValidationError: (state, action) => {
            const { name } = action.payload;

            const index = state?.validationErrors?.findIndex(
                (error) => error.name === name
            );

            if (index !== -1) state?.validationErrors?.splice(index, 1);
        },

        setValidationErrors: (state, action) => {
            state.validationErrors = [...action.payload];
        },

        addValidationErrors: (state, action) => {
            state.validationErrors = [
                ...state.validationErrors,
                ...action.payload,
            ];
        },
    },
    extraReducers: (builder) => {
        builder
            /** Login */
            .addCase(login.pending, (state) => {
                state.errors = [];
            })
            .addCase(login.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.currentUser = null;

                if (action.payload.errors) {
                    state.errors = action.payload.errors;
                } else {
                    state.errors = [action.payload.message];
                }
            })

            /** Logout user */
            .addCase(logout.fulfilled, (state) => {
                state.currentUser = null;
            })
            .addCase(logout.rejected, (state) => {
                state.currentUser = null;
            })

            /** Restore user */
            .addCase(restoreUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
            })
            .addCase(restoreUser.rejected, (state) => {
                state.currentUser = null;
            })

            /** Signup */
            .addCase(signup.pending, (state) => {
                state.errors = [];
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
            })
            .addCase(signup.rejected, (state, action) => {
                state.currentUser = null;

                if (action.payload.errors) {
                    state.errors = action.payload.errors;
                } else {
                    state.errors = [action.payload.message];
                }
            });
    },
});

export default userSlice.reducer;

export const {
    clearErrors,
    clearValidationError,
    clearValidationErrors,
    setValidationErrors,
    addValidationErrors,
} = userSlice.actions;
