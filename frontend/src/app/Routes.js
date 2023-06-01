import { Route, Routes } from 'react-router-dom';

import CreateSpotPage from '../features/spots/spot/createSpot/CreateSpotPage';
import SpotPage from '../features/spots/SpotPage';
import ErrorPage from '../common/components/ErrorPage/ErrorPage';
import LandingPage from '../features/landing/LandingPage';
import BookingsPage from '../features/bookings/BookingsPage';

const RoutesComponent = ({ showGenericPopup, hideGenericPopup }) => {
    return (
        <Routes>
            <Route
                exact
                path='/'
                element={<LandingPage />}
            />

            <Route
                path='/spots/:spotId'
                element={
                    <SpotPage
                        showGenericPopup={showGenericPopup}
                        hideGenericPopup={hideGenericPopup}
                    />
                }
            />

            <Route
                path='/create-spot'
                element={<CreateSpotPage />}
            />

            <Route
                path='/bookings'
                element={<BookingsPage />}
            />

            <Route
                path='*'
                element={
                    <ErrorPage
                        status={'Resource not found'}
                        message={
                            'Sorry, the page you are looking for does not exist!'
                        }
                    />
                }
            />
        </Routes>
    );
};

export default RoutesComponent;
