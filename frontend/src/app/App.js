import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { restoreUser } from '../features/user/userSlice';
import LoginForm from '../features/user/forms/login/LoginForm';
import SignupForm from '../features/user/forms/signup/SignupForm';
import NavigationBar from '../features/navbar/NavigationBar';
import Footer from '../features/footer/Footer';

import Loader from '../common/components/Loader/Loader';
import Backdrop from '../common/components/Backdrop/Backdrop';
import PopupModal from '../common/components/PopupModal/PopupModal';
import RoutesComponent from './Routes';

import './App.css';
const App = () => {
    const dispatch = useDispatch();

    const [isLoaded, setIsLoaded] = useState(false);
    const [signupModalVisible, setSignupModalVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);

    const [genericPopup, setGenericPopup] = useState({
        visible: false,
        header: null,
        content: null,
        type: null,
        style: null,
    });

    const showGenericPopup = (header, content, type, style) => {
        setGenericPopup({
            visible: true,
            header,
            content,
            type,
            style,
        });
    };

    const hideGenericPopup = () => {
        setGenericPopup({
            visible: false,
            header: null,
            content: null,
            type: null,
            style: null,
        });
    };

    const hideSignupModal = () => {
        setSignupModalVisible(false);
    };

    const hideLoginModal = () => {
        setLoginModalVisible(false);
    };

    useEffect(() => {
        dispatch(restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    // Disables the scrollbar when popup modal is visible
    useEffect(() => {
        if (genericPopup.visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [genericPopup.visible]);

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
                {(signupModalVisible ||
                    loginModalVisible ||
                    genericPopup.visible) && <Backdrop />}

                {genericPopup.visible && (
                    <PopupModal
                        header={genericPopup.header}
                        content={genericPopup.content}
                        onClose={hideGenericPopup}
                        type={genericPopup.type}
                        style={genericPopup.style}
                    />
                )}
                {signupModalVisible && (
                    <SignupForm hideSignupModal={hideSignupModal} />
                )}
                {loginModalVisible && (
                    <LoginForm hideLoginModal={hideLoginModal} />
                )}

                {/*
                 * Where all of the content resides
                 */}
                <div className='page-container'>
                    <RoutesComponent
                        showGenericPopup={showGenericPopup}
                        hideGenericPopup={hideGenericPopup}
                    />
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
