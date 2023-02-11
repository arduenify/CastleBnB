import { useNavigate } from 'react-router-dom';

const HostCastle = () => {
    const navigate = useNavigate();

    return (
        <button
            id='host-castle-btn'
            onClick={() => navigate('/create-spot')}
        >
            Host a Castle
        </button>
    );
};

export default HostCastle;
