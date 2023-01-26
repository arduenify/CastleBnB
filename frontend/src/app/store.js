import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import logger from 'redux-logger';

const reducer = {
    user: userReducer,
};

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
});
