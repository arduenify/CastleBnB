import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from './spotsSlice';
import SpotComponent from './SpotComponent';

import './SpotsGridComponent.css';

const SpotsGridComponent = () => {
    const spots = useSelector((state) => state.spot.spots);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    if (!spots || !spots.length) return null;

    return (
        <div className='spots-container'>
            {spots.map((spot) => (
                <SpotComponent
                    key={spot.id}
                    spot={spot}
                />
            ))}
        </div>
    );
};

export default SpotsGridComponent;
