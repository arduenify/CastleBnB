import { useState } from 'react';
import { useSelector } from 'react-redux';

import SignupFormComponent from '../user/SignupFormComponent';
import LoginFormComponent from '../user/LoginFormComponent';

export const LandingPageComponent = () => {
    const [signupVisible, setSignupVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);

    return (
        <div className='landing-page-container'>
            <div className='landing-page-content'></div>
        </div>
    );
};

export default LandingPageComponent;
