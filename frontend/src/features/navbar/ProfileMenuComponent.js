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
                    className='navbar-btn'
                    onClick={signupBtnClicked}
                >
                    Signup
                </li>
            )}

            {!currentUser && (
                <li
                    className='navbar-btn'
                    onClick={loginBtnClicked}
                >
                    Login
                </li>
            )}

            {currentUser && (
                <li
                    className='navbar-btn'
                    onClick={logoutBtnClicked}
                >
                    Logout
                </li>
            )}
        </ul>
    );
};

export default ProfileMenuComponent;
