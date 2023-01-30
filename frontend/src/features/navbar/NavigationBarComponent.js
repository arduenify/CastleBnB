import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from 'react-router-dom';

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
            if (profileMenuVisible) {
                if (e.target.id !== 'profile-menu') {
                    setProfileMenuVisible(false);
                }
            }
        };

        document.addEventListener('click', outsideClicked);

        return () => {
            document.removeEventListener('click', outsideClicked);
        };
    }, [profileMenuVisible]);

    useEffect(() => {
        if (signupVisible || loginVisible) {
            document.body.classList.add('popup-modal-visible');
        } else {
            document.body.classList.remove('popup-modal-visible');
        }

        // Also, need to close the menu if it's open
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
