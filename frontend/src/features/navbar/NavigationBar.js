import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';

// import Search from './Search';
import ProfileMenu from './ProfileMenu';
import Logo from '../../common/components/Logo/Logo';
import Search from './Search';
import HostCastle from './HostCastle';

import './NavigationBar.css';

const NavigationBar = ({
    signupVisible,
    loginVisible,
    setSignupVisible,
    setLoginVisible,
    style,
}) => {
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    const currentUser = useSelector((state) => state.user.currentUser);

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
                    <Logo />
                </div>

                <div className='navbar-middle'>
                    <Search />
                </div>

                <div className='navbar-right'>
                    {currentUser && <HostCastle />}

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
                        <ProfileMenu
                            setSignupVisible={setSignupVisible}
                            setLoginVisible={setLoginVisible}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
