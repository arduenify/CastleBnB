import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import LoginFormComponent from '../features/user/LoginFormComponent';
import LandingPageComponent from '../features/landing/LandingPageComponent';

import { restoreUser } from '../features/user/userSlice';

import './App.css';
import NavigationBarComponent from '../features/navbar/NavigationBarComponent';

const App = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        isLoaded && (
            <>
                <NavigationBarComponent></NavigationBarComponent>

                <Routes>
                    <Route
                        exact
                        path='/'
                        element={<LandingPageComponent />}
                    />
                    <Route
                        exact
                        path='/login'
                        element={<LoginFormComponent />}
                    />
                </Routes>
            </>
        )
    );
};

export default App;
