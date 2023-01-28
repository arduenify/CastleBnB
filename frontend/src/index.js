import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { restoreCSRF, csrfFetch } from './app/csrf';
import { login, restoreUser, signup } from './features/user/userSlice';

import './index.css';
import './style/normalize.css';

if (process.env.NODE_ENV !== 'production') {
    restoreCSRF();

    // Tests
    window.csrfFetch = csrfFetch;
    window.store = store;
    window.userActions = { login, restoreUser, signup };
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
