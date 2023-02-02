import { Route, Routes } from 'react-router-dom';

import LandingPage from '../features/landing/LandingPage';
import SpotPage from '../features/spots/SpotPage';

const RoutesComponent = () => {
    return (
        <Routes>
            <Route
                exact
                path='/'
                element={<LandingPage />}
            />

            <Route
                path='/spots/:spotId'
                element={<SpotPage />}
            />

            <Route
                path='*'
                element={
                    <h1
                        style={{
                            textAlign: 'center',
                            marginTop: '150px',
                        }}
                    >
                        404: Page Not Found
                    </h1>
                }
            />
        </Routes>
    );
};

export default RoutesComponent;
