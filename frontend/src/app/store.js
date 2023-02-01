import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import userReducer from '../features/user/userSlice';
import spotReducer from '../features/spots/spotsSlice';

const reducer = {
    user: userReducer,
    spot: spotReducer,
};

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        process.env.NODE_ENV !== 'production'
            ? getDefaultMiddleware().concat(logger)
            : getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});
