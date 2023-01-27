import { useState } from 'react';
import { useSelector } from 'react-redux';

import SignupFormComponent from '../user/SignupFormComponent';
import LoginFormComponent from '../user/LoginFormComponent';

export const LandingPageComponent = () => {
    const [signupVisible, setSignupVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);

    const signupBtnClicked = (e) => {
        e.preventDefault();

        setSignupVisible(true);
    };

    const loginBtnClicked = (e) => {
        e.preventDefault();

        setLoginVisible(true);
    };

    return (
        <div className='landing-page-container'>
            <div className='landing-page-content'>
               

                {!currentUser && (
                    <div className='landing-page-btn-container'>
                        <button
                            className='landing-page-btn'
                            onClick={signupBtnClicked}
                        >
                            Signup
                        </button>
                        <button
                            className='landing-page-btn'
                            onClick={loginBtnClicked}
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPageComponent;
