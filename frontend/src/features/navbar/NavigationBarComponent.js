import { useState } from 'react';
import { useSelector } from 'react-redux';

import LoginFormComponent from '../user/LoginFormComponent';
import SignupFormComponent from '../user/SignupFormComponent';
import SearchComponent from './SearchComponent';
import LogoComponent from '../../common/LogoComponent';

import './NavigationBarComponent.css';

const NavigationBarComponent = () => {
    const [signupVisible, setSignupVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const currentUser = useSelector((state) => state.user.currentUser);

    return (
        <nav className='navbar-container'>
            <div className='navbar-content'>
                <div className='navbar-left'>
                    <a href='/'>
                        <LogoComponent />
                    </a>
                </div>

                <div className='navbar-middle'>
                    <SearchComponent />
                </div>

                <div className='navbar-right'>
                    {/* More elements here later */}
                    <div className='navbar-login'>
                        {signupVisible && !currentUser && (
                            <SignupFormComponent
                                setSignupVisible={setSignupVisible}
                            />
                        )}
                        {loginVisible && !currentUser && (
                            <LoginFormComponent
                                setLoginVisible={setLoginVisible}
                            />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBarComponent;
