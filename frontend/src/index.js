import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { restoreCSRF, csrfFetch } from './app/csrf';
import './index.css';

if (process.env.NODE_ENV !== 'production') {
    restoreCSRF();

    // Tests
    window.csrfFetch = csrfFetch;
    window.store = store;
}

const Root = () => {
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>;
};

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById('root')
);
