import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { login } from './userSlice';

import './LoginFormComponent.css';
import PopupModalComponent from '../../common/popupModal/PopupModalComponent';
import FormInputComponent from '../../common/input/FormInputComponent';

const LoginFormComponent = ({ setLoginVisible }) => {
    const dispatch = useDispatch();

    const loginErrors = useSelector((state) => state.user.errors);

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');

    const loginBtnClicked = (e) => {
        e.preventDefault();

        dispatch(login({ credential, password }));
    };

    const loginForm = (
        <form
            id='popup-modalLoginForm'
            onSubmit={loginBtnClicked}
        >
            <FormInputComponent
                placeholder='Email/username'
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
            />

            <FormInputComponent
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
    );

    return (
        <PopupModalComponent
            header={'Login'}
            content={loginForm}
            setVisible={setLoginVisible}
        />
    );
};

export default LoginFormComponent;
