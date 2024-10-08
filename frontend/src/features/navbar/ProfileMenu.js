import { useDispatch, useSelector } from 'react-redux';

import { login, logout } from '../user/userSlice';

import './ProfileMenu.css';

const ProfileMenu = ({ setSignupVisible, setLoginVisible }) => {
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

    const demoUserBtnClicked = (e) => {
        e.preventDefault();

        dispatch(login({ credential: 'adamscoggins', password: 'iloveaa' }));
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

            {!currentUser && (
                <li
                    id='profile-menu-demo-user'
                    className='profile-menu-btn'
                    onClick={demoUserBtnClicked}
                >
                    <p className='profile-menu-text'>Demo user</p>
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

export default ProfileMenu;
