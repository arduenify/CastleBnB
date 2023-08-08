import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import loadingReducer, {
    loadingMiddleware,
} from '../common/components/Loader/loadingSlice';
import userReducer from '../features/user/userSlice';
import spotReducer from '../features/spots/spotsSlice';
import bookingReducer from '../features/bookings/bookingSlice';

const reducer = {
    user: userReducer,
    spot: spotReducer,
    loading: loadingReducer,
    booking: bookingReducer,
};

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
        const defaultMiddleware = getDefaultMiddleware();

        if (process.env.NODE_ENV === 'development') {
            defaultMiddleware.concat(logger);
        }

        return [...defaultMiddleware, loadingMiddleware];
    },
    devTools: process.env.NODE_ENV !== 'production',
});
