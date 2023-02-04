import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        loading: false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;

// Used for global loading state
export const loadingMiddleware = (store) => (next) => (action) => {
    try {
        const { type } = action;

        if (type.endsWith('/pending')) {
            store.dispatch(setLoading(true));
        } else if (type.endsWith('/fulfilled') || type.endsWith('/rejected')) {
            store.dispatch(setLoading(false));
        }

        next(action);
    } catch (err) {
        console.log(err);
    }
};
