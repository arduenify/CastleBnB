import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { signup } from './userSlice';

const SignupFormComponent = ({ setSignupVisible }) => {
    const dispatch = useDispatch();
    const errors = useSelector((state) => state.user.errors);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const hideModal = () => setSignupVisible(false);

    const closeModalBtnClicked = (e) => {
        e.preventDefault();

        hideModal();
    };

    const signupBtnClicked = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setPasswordMatchError('Passwords do not match');
        }

        dispatch(signup({ email, username, password, firstName, lastName }));
    };

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
                    id='popup-modalSignupForm'
                    onSubmit={signupBtnClicked}
                >
                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='First name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='Last name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        className='popup-modal-input'
                        type='text'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                        className='popup-modal-btn'
                        type='submit'
                    >
                        Sign up
                    </button>

                    <div className='popup-modal-errors'>
                        {passwordMatchError && <div>{passwordMatchError}</div>}

                        {errors &&
                            errors.map((error, idx) => (
                                <div key={idx}>{error}</div>
                            ))}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupFormComponent;
