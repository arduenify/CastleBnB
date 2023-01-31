import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import userReducer from '../features/user/userSlice';

const reducer = {
    user: userReducer,
};

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        process.env.NODE_ENV !== 'production'
            ? getDefaultMiddleware().concat(logger)
            : getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});
