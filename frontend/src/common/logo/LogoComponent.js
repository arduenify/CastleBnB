import logo from './logo-transparent.png';
import { useNavigate } from 'react-router-dom';

import './LogoComponent.css';

const LogoComponent = () => {
    const navigate = useNavigate();

    return (
        <div
            id='logo-img-container'
            className='logo'
            onClick={() => navigate('/')}
        >
            <img
                id='logo-img'
                src={logo}
            />
        </div>
    );
};

export default LogoComponent;
