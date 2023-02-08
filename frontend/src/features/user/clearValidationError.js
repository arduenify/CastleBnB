import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { clearValidationError } from './userSlice';

// Custom Hook to clear validation errors upon typing. Not used for passwords
const useClearValidationError = (name, value) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (value) {
            dispatch(clearValidationError({ name }));
        }
    }, [value, dispatch, name]);
};

export default useClearValidationError;
