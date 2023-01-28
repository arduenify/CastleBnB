import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../user/userSlice';

import './ProfileMenuComponent.css';

const ProfileMenuComponent = ({ setSignupVisible, setLoginVisible }) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.user.currentUser);

    const signupBtnClicked = (e) => {
        e.preventDefault();

        setLoginVisible(false);
        setSignupVisible(true);
    };

    const loginBtnClicked = (e) => {
        e.preventDefault();
        setSignupVisible(false);
        setLoginVisible(true);
    };

    const logoutBtnClicked = (e) => {
        e.preventDefault();
        dispatch(logout());
    };

    return (
        <ul id='profile-menu'>
            {!currentUser && (
                <li
                    id='profile-menu-signup-btn'
                    className='profile-menu-btn'
                    onClick={signupBtnClicked}
                >
                    <p className='profile-menu-text'>Sign up</p>
                </li>
            )}

            {!currentUser && (
                <li
                    id='profile-menu-login-btn'
                    className='profile-menu-btn'
                    onClick={loginBtnClicked}
                >
                    <p className='profile-menu-text'>Log in</p>
                </li>
            )}

            {currentUser && (
                <li
                    id='profile-menu-logout-btn'
                    className='profile-menu-btn'
                    onClick={logoutBtnClicked}
                >
                    <p className='profile-menu-text'>Logout</p>
                </li>
            )}
        </ul>
    );
};

export default ProfileMenuComponent;
