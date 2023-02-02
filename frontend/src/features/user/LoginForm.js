import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    clearValidationError,
    clearValidationErrors,
    clearErrors,
    login,
    setValidationErrors,
} from './userSlice';

import './LoginForm.css';
import PopupModal from '../../common/popupModal/PopupModal';
import FormInput from '../../common/input/FormInput';
import FormErrors from './FormErrors';

const LoginForm = ({ setLoginVisible }) => {
    const dispatch = useDispatch();

    const loginErrors = useSelector((state) => state.user.errors);
    const validationErrors = useSelector(
        (state) => state.user.validationErrors
    );

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');

    const loginBtnClicked = (e) => {
        e.preventDefault();

        const newErrors = [];

        if (!credential)
            newErrors.push({
                name: 'credential',
                msg: 'Please enter your email or username',
            });

        if (!password)
            newErrors.push({
                name: 'password',
                msg: 'Please enter your password',
            });

        if (newErrors.length) {
            dispatch(setValidationErrors(newErrors));
        } else {
            dispatch(login({ credential, password }));
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearErrors());
            dispatch(clearValidationErrors());
        };
    }, []);

    useEffect(() => {
        if (credential) {
            dispatch(clearValidationError({ name: 'credential' }));
        }

        if (password) {
            dispatch(clearValidationError({ name: 'password' }));
        }
    }, [credential, password]);

    return (
        <PopupModal
            header={'Login'}
            setVisible={setLoginVisible}
            content={
                <form
                    id='popup-modal-login-form'
                    onSubmit={loginBtnClicked}
                >
                    <div className='form-input-container'>
                        <FormInput
                            name='credential'
                            placeholder='Email/username'
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                        />

                        <FormInput
                            name='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className='popup-modal-button'
                        type='submit'
                    >
                        Login
                    </button>

                    <FormErrors
                        errors={loginErrors}
                        validationErrors={validationErrors}
                    />
                </form>
            }
        />
    );
};

export default LoginForm;
