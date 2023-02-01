import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import LoginFormComponent from '../features/user/LoginFormComponent';
import SignupFormComponent from '../features/user/SignupFormComponent';
import LandingPageComponent from '../features/landing/LandingPageComponent';
import NavigationBarComponent from '../features/navbar/NavigationBarComponent';
import LoaderComponent from '../common/loader/LoaderComponent';

import { restoreUser } from '../features/user/userSlice';

import './App.css';
import FooterComponent from '../features/footer/FooterComponent';
import BackdropComponent from '../common/backdrop/BackdropComponent';

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

    return (
        isLoaded && (
            <>
                <header>
                    <NavigationBarComponent
                        logoutVisible={logoutVisible}
                        loginVisible={loginVisible}
                        setLoginVisible={setLoginVisible}
                        signupVisible={signupVisible}
                        setSignupVisible={setSignupVisible}
                    />
                </header>

                <LoaderComponent />

                {/* The backdrop for when a popup modal is visible*/}
                {(signupVisible || loginVisible) && <BackdropComponent />}

                {signupVisible && (
                    <SignupFormComponent setSignupVisible={setSignupVisible} />
                )}
                {loginVisible && (
                    <LoginFormComponent setLoginVisible={setLoginVisible} />
                )}

                {/*
                 * Where all of the content resides
                 */}
                <div className='page-container'>
                    <Routes>
                        <Route
                            exact
                            path='/'
                            element={<LandingPageComponent />}
                        />
                        <Route
                            path='*'
                            element={
                                <h1
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '150px',
                                    }}
                                >
                                    404: Page Not Found
                                </h1>
                            }
                        />
                    </Routes>
                </div>

                {window.location.pathname === '/' && (
                    <footer>
                        <FooterComponent />
                    </footer>
                )}
            </>
        )
    );
};

export default App;
