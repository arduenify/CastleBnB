import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../spotsSlice';
import SpotGridItem from './SpotGridItem';
import './SpotsGrid.css';
import ErrorPage from '../../../common/errorPage/ErrorPage';

const SpotsGrid = () => {
    const spots = useSelector((state) => state.spot.spots);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    if (!spots.length) return <ErrorPage message={'No spots found'} />;

    return (
        <div className='spots-container'>
            {spots.map((spot) => (
                <SpotGridItem
                    key={spot.id}
                    spot={spot}
                />
            ))}
        </div>
    );
};

export default SpotsGrid;
