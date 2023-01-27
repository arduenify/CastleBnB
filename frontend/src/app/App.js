import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import LoginFormComponent from '../features/user/LoginFormComponent';
import { restoreUser } from '../features/user/userSlice';

import './App.css';

const App = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        isLoaded && (
            <Routes>
                <Route
                    exact
                    path='/'
                    element={<h1>Home Page</h1>}
                />
                <Route
                    exact
                    path='/login'
                    element={<LoginFormComponent />}
                />
            </Routes>
        )
    );
};

export default App;
