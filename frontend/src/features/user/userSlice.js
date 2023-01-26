import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { csrfFetch } from '../../app/csrf';

const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'login',
    async ({ credential, password }, thunkAPI) => {
        const response = await csrfFetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                credential,
                password,
            }),
        });

        if (!response.ok) {
            thunkAPI.rejectWithValue(response.statusText);
        }

        const data = await response.json();
        thunkAPI.dispatch(setUser(data.user));

        return response;
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: {
        [login.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [login.fulfilled]: (state) => {
            state.loading = false;
        },
        [login.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
