import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import LoginFormComponent from '../features/user/LoginFormComponent';
import SignupFormComponent from '../features/user/SignupFormComponent';
import LandingPageComponent from '../features/landing/LandingPageComponent';
import NavigationBarComponent from '../features/navbar/NavigationBarComponent';

import { restoreUser } from '../features/user/userSlice';

import './App.css';

const App = () => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.user.currentUser);

    const [isLoaded, setIsLoaded] = useState(false);
    const [signupVisible, setSignupVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const [logoutVisible, setLogoutVisible] = useState(false);

    useEffect(() => {
        dispatch(restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    useEffect(() => {
        if (currentUser) {
            // A logged in user has no need for these!
            setLoginVisible(false);
            setSignupVisible(false);
            // But they do need to be able to logout
            setLogoutVisible(true);
        } else {
            setLogoutVisible(false);
        }
    }, [currentUser]);

    useEffect(() => {
        // This will dynamically change the background color of the page
        //  when a popup is visible
        document.documentElement.style.setProperty(
            '--bg-color',
            signupVisible || loginVisible
                ? 'var(--colors-backdrop)'
                : 'var(--colors-white)'
        );
    }, [signupVisible, loginVisible]);

    return (
        isLoaded && (
            <>
                <NavigationBarComponent
                    logoutVisible={logoutVisible}
                    setLoginVisible={setLoginVisible}
                    setSignupVisible={setSignupVisible}
                />

                {signupVisible && !loginVisible && (
                    <SignupFormComponent setSignupVisible={setSignupVisible} />
                )}
                {loginVisible && !signupVisible && (
                    <LoginFormComponent setLoginVisible={setLoginVisible} />
                )}

                <div
                    className='page-container'
                    /* If the signup or login form is visible, this element background should be #222 */
                >
                    <Routes>
                        <Route
                            exact
                            path='/'
                            element={<LandingPageComponent />}
                        />
                        <Route
                            path='*'
                            element={<h1>404: Page Not Found</h1>}
                        />
                    </Routes>
                </div>
            </>
        )
    );
};

export default App;
