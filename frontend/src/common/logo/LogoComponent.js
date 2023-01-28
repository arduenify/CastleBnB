import logo from './logo.png';

import './LogoComponent.css';

const LogoComponent = () => {
    return (
        <div
            id='logo-img-container'
            className='logo'
        >
            <img
                id='logo-img'
                src={logo}
            />
        </div>
    );
};

export default LogoComponent;
