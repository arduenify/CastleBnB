import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import {
    clearErrors,
    clearValidationErrors,
    clearValidationError,
    setValidationErrors,
    signup,
} from '../../userSlice';

import { getError } from '../../../../common/helpers';
import useClearValidationError from '../errors/clearValidationError';

import PopupModal from '../../../../common/components/PopupModal/PopupModal';
import FormInput from '../../../../common/components/FormInput/FormInput';
import FormErrors from '../errors/FormErrors';

const SignupForm = ({ hideSignupModal }) => {
    const dispatch = useDispatch();
    const errors = useSelector((state) => state.user.errors);
    const validationErrors = useSelector(
        (state) => state.user.validationErrors
    );

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Sets the validation errors as well as handling the signup itself
    const signupBtnClicked = (e) => {
        e.preventDefault();

        const fields = [
            { name: 'email', value: email, msg: 'Email is required' },
            {
                name: 'username',
                value: username,
                msg: 'Username is required',
            },
            {
                name: 'password',
                value: password,
                msg: 'Password is required',
            },
            {
                name: 'confirmPassword',
                value: confirmPassword,
                msg: 'Confirm password is required',
            },
            {
                name: 'firstName',
                value: firstName,
                msg: 'First name is required',
            },
            {
                name: 'lastName',
                value: lastName,
                msg: 'Last name is required',
            },
        ];

        const newErrors = fields.filter(({ value }) => !value);

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.push({
                name: 'password',
                msg: 'Passwords do not match',
            });

            newErrors.push({
                name: 'confirmPassword',
            });
        }

        if (newErrors.length) {
            return dispatch(setValidationErrors(newErrors));
        }

        dispatch(
            signup({ email, username, password, firstName, lastName })
        ).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                hideSignupModal();
            }
        });
    };

    // Cleans up the errors
    useEffect(() => {
        return () => {
            dispatch(clearErrors());
            dispatch(clearValidationErrors());
        };
    }, [dispatch]);

    // Clears the validation errors on input change
    useClearValidationError('email', email);
    useClearValidationError('username', username);
    useClearValidationError('firstName', firstName);
    useClearValidationError('lastName', lastName);

    // Clears the password validation errors
    useEffect(() => {
        if (!validationErrors || !validationErrors.length) return;

        const clearError = (name) => {
            dispatch(clearValidationError({ name }));
        };

        const getError = (name) => {
            return validationErrors.find((error) => error.name === name);
        };

        const clearRequiredError = (name, value) => {
            const error = getError(name);
            const errorMsg = error?.msg;

            if (!error || !errorMsg) return;

            if (errorMsg.includes('required') && value) {
                clearError(name);
            }
        };

        const clearMatchedPasswordError = () => {
            const passwordError = getError('password');

            if (
                passwordError?.msg.includes('match') &&
                password === confirmPassword
            ) {
                clearError('password');
                clearError('confirmPassword');
            }
        };

        clearRequiredError('password', password);
        clearRequiredError('confirmPassword', confirmPassword);
        clearMatchedPasswordError();
    }, [password, confirmPassword, validationErrors, dispatch]);

    return (
        <PopupModal
            header={'Sign up'}
            onClose={hideSignupModal}
            content={
                <form
                    id='popup-modal-signup-form'
                    onSubmit={signupBtnClicked}
                >
                    <div className='form-input-container'>
                        <FormInput
                            name={'email'}
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            validationError={getError(
                                'email',
                                validationErrors
                            )}
                        />

                        <FormInput
                            name={'username'}
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            validationError={getError(
                                'username',
                                validationErrors
                            )}
                        />

                        <FormInput
                            name={'firstName'}
                            placeholder='First name'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            validationError={getError(
                                'firstName',
                                validationErrors
                            )}
                        />

                        <FormInput
                            name={'lastName'}
                            placeholder='Last name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            validationError={getError(
                                'lastName',
                                validationErrors
                            )}
                        />

                        <FormInput
                            name={'password'}
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            validationError={getError(
                                'password',
                                validationErrors
                            )}
                        />

                        <FormInput
                            name={'confirmPassword'}
                            placeholder='Confirm password'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            validationError={getError(
                                'confirmPassword',
                                validationErrors
                            )}
                        />
                    </div>

                    <button
                        className='popup-modal-btn'
                        type='submit'
                    >
                        Sign up
                    </button>

                    <FormErrors
                        errors={errors}
                        validationErrors={validationErrors}
                    />
                </form>
            }
        />
    );
};

export default SignupForm;
