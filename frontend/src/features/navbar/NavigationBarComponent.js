import SearchComponent from './SearchComponent';
import ProfileMenuComponent from './ProfileMenuComponent';
import LogoComponent from '../../common/LogoComponent';

import './NavigationBarComponent.css';

const NavigationBarComponent = ({
    setSignupVisible,
    setLoginVisible,
    style,
}) => {
    return (
        <nav
            className='navbar-container'
            style={style}
        >
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
                    <ProfileMenuComponent
                        setSignupVisible={setSignupVisible}
                        setLoginVisible={setLoginVisible}
                    />
                </div>
            </div>
        </nav>
    );
};

export default NavigationBarComponent;
