import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { csrfFetch } from './csrf';
import userReducer from '../features/user/userSlice';

const reducer = {
    user: userReducer,
};

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
});




