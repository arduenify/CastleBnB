import { Route, Routes } from 'react-router-dom';
import ErrorPage from '../common/errorPage/ErrorPage';

import LandingPage from '../features/landing/LandingPage';
import SpotPage from '../features/spots/SpotPage';

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
