import { useSelector } from 'react-redux';
import './Loader.css';

const Loader = () => {
    // const userLoading = useSelector((state) => state.user.loading);
    const loading = useSelector((state) => state.loading.loading);

    if (loading)
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

export default Loader;
