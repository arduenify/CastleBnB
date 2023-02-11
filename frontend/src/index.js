import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './app/store';
import { restoreCSRF, csrfFetch } from './services/csrf';
import { login, restoreUser, signup } from './features/user/userSlice';
import { getAllSpots, getSpotById } from './features/spots/spotsSlice';

import App from './app/App';

import './index.css';
import './style/normalize.css';

if (process.env.NODE_ENV !== 'production') {
    restoreCSRF();

    // Tests
    window.csrfFetch = csrfFetch;
    window.store = store;
    window.userActions = { login, restoreUser, signup };
    window.spotActions = { getAllSpots, getSpotById };
}

const Root = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById('root')
);
