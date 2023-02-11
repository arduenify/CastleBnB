import Cookies from 'js-cookie';

export const csrfFetch = async (url, options = {}) => {
    options.method = options.method || 'GET';
    options.headers = options.headers || {};

    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] =
            options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    const res = window.fetch(url, options);

    return res;
};

export const csrfFetchPost = async (url, body = {}) =>
    csrfFetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
    });

export const csrfFetchPut = async (url, body = {}) =>
    csrfFetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

export const csrfFetchDelete = async (url) =>
    csrfFetch(url, {
        method: 'DELETE',
    });

export const restoreCSRF = () => csrfFetch('/api/csrf/restore');
