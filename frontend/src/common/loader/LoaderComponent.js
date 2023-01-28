import { useSelector } from 'react-redux';
import './LoaderComponent.css';

const LoaderComponent = () => {
    const userLoading = useSelector((state) => state.user.loading);

    if (userLoading)
        return (
            <div className='loader'>
                <div className='loader-container'>
                    <div className='loader-spinner'>
                        <span className='spinner'></span>
                    </div>
                </div>
            </div>
        );

    return null;
};

export default LoaderComponent;
