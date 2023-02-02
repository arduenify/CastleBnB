import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import LoginForm from '../features/user/LoginForm';
import SignupForm from '../features/user/SignupForm';
import LandingPage from '../features/landing/LandingPage';
import NavigationBar from '../features/navbar/NavigationBar';
import Loader from '../common/loader/Loader';

import { restoreUser } from '../features/user/userSlice';

import './App.css';
import Footer from '../features/footer/Footer';
import Backdrop from '../common/backdrop/Backdrop';
import RoutesComponent from './Routes';

const App = () => {
    const dispatch = useDispatch();

    const [isLoaded, setIsLoaded] = useState(false);
    const [signupModalVisible, setSignupModalVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);

    useEffect(() => {
        dispatch(restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        isLoaded && (
            <>
                <header>
                    <NavigationBar
                        loginVisible={loginModalVisible}
                        setLoginVisible={setLoginModalVisible}
                        signupVisible={signupModalVisible}
                        setSignupVisible={setSignupModalVisible}
                    />
                </header>

                <Loader />

                {/* The backdrop for when a popup modal is visible*/}
                {(signupModalVisible || loginModalVisible) && <Backdrop />}

                {signupModalVisible && (
                    <SignupForm setSignupVisible={setSignupModalVisible} />
                )}
                {loginModalVisible && (
                    <LoginForm setLoginVisible={setLoginModalVisible} />
                )}

                {/*
                 * Where all of the content resides
                 */}
                <div className='page-container'>
                    <RoutesComponent />
                </div>

                {window.location.pathname === '/' && (
                    <footer>
                        <Footer />
                    </footer>
                )}
            </>
        )
    );
};

export default App;
