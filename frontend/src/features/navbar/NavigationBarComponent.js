import { useDispatch, useSelector } from 'react-redux';

import SearchComponent from './SearchComponent';
import LogoComponent from '../../common/LogoComponent';

import { logout } from '../user/userSlice';

import './NavigationBarComponent.css';

const NavigationBarComponent = ({ setSignupVisible, setLoginVisible }) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.user.currentUser);

    const signupBtnClicked = (e) => {
        e.preventDefault();

        setSignupVisible(true);
    };

    const loginBtnClicked = (e) => {
        e.preventDefault();

        setLoginVisible(true);
    };

    const logoutBtnClicked = (e) => {
        e.preventDefault();

        dispatch(logout());
    };

    return (
        <nav className='navbar-container'>
            <div className='navbar-content'>
                <div className='navbar-left'>
                    <a href='/'>
                        <LogoComponent />
                    </a>
                </div>

                <div className='navbar-middle'>
                    <SearchComponent />
                </div>

                <div className='navbar-right'>
                    <div className='navbar-btn-container'>
                        {/* Signup / login buttons */}
                        {!currentUser && (
                            <>
                                <button
                                    className='navbar-btn'
                                    onClick={signupBtnClicked}
                                >
                                    Signup
                                </button>
                                <button
                                    className='navbar-btn'
                                    onClick={loginBtnClicked}
                                >
                                    Login
                                </button>
                            </>
                        )}

                        {/* Logout button */}
                        {currentUser && (
                            <button
                                className='navbar-btn'
                                onClick={logoutBtnClicked}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBarComponent;
