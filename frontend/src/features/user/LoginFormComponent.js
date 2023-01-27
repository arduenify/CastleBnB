import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { login } from './userSlice';

import './LoginFormComponent.css';

const LoginFormComponent = ({ setLoginVisible }) => {
    const dispatch = useDispatch();

    const loginErrors = useSelector((state) => state.user.errors);

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');

    const hideModal = () => setLoginVisible(false);

    const loginBtnClicked = (e) => {
        e.preventDefault();
        dispatch(login({ credential, password }));
    };

    const closeModalBtnClicked = (e) => {
        e.preventDefault();

        hideModal();
    };

    // if (currentUser) {
    //     return <Navigate to='/' />;
    // }

    return (
        <div className='popup-modal'>
            <div className='popup-modal-header flex-container'>
                <button
                    className='close-modal-btn'
                    onClick={closeModalBtnClicked}
                >
                    &times;
                </button>
                <h6 className='popup-modal-header-text'>Log in or sign up</h6>
            </div>

            <div className='popup-modalBody'>
                <form
                    id='popup-modalLoginForm'
                    onSubmit={loginBtnClicked}
                >
                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='Email/username'
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                    />

                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className='popup-modal-button'
                        type='submit'
                    >
                        Login
                    </button>

                    <ul>
                        {loginErrors &&
                            loginErrors.map((error, index) => (
                                <li
                                    className='popup-modal-error'
                                    key={index}
                                >
                                    {error}
                                </li>
                            ))}
                    </ul>
                </form>
            </div>
        </div>
    );
};

export default LoginFormComponent;
