import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';

import SearchComponent from './SearchComponent';
import ProfileMenuComponent from './ProfileMenuComponent';
import LogoComponent from '../../common/logo/LogoComponent';

import './NavigationBarComponent.css';

const NavigationBarComponent = ({
    signupVisible,
    loginVisible,
    setSignupVisible,
    setLoginVisible,
    style,
}) => {
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    const profileIconClicked = (e) => {
        setProfileMenuVisible(!profileMenuVisible);
    };

    useEffect(() => {
        // We need a way to close the menu with no button
        //  this will do the job!
        const outsideClicked = (e) => {
            if (profileMenuVisible && e.target.id !== 'profile-icon') {
                setProfileMenuVisible(false);
            }
        };

        document.addEventListener('click', outsideClicked);

        return () => {
            document.removeEventListener('click', outsideClicked);
        };
    }, [profileMenuVisible]);

    useEffect(() => {
        setProfileMenuVisible(false);
    }, [signupVisible, loginVisible]);

    return (
        <nav
            className='navbar-container'
            style={style}
        >
            <div className='navbar-content'>
                <div className='navbar-left'>
                    <LogoComponent />
                </div>

                <div className='navbar-middle'>
                    <SearchComponent />
                </div>

                <div className='navbar-right'>
                    <div
                        className='navbar-right-icons'
                        onClick={profileIconClicked}
                    >
                        <FontAwesomeIcon
                            id='profile-menu-icon'
                            icon={faBars}
                            pull='left'
                        />
                        <FontAwesomeIcon
                            id='profile-icon'
                            icon={faUser}
                            pull='right'
                        />
                    </div>

                    {profileMenuVisible && (
                        <ProfileMenuComponent
                            setSignupVisible={setSignupVisible}
                            setLoginVisible={setLoginVisible}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavigationBarComponent;
