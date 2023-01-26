const express = require('express');
const router = express.Router();

// Add a XSRF-TOKEN cookie
if (process.env.NODE_ENV !== 'production') {
    router.get('/api/csrf/restore', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());

        return res.json({});
    });
}

// Routers
router.use('/api', require('./api'));
router.use('/users', require('./users'));
router.use('/spots', require('./spots'));
router.use('/reviews', require('./reviews'));
router.use('/bookings', require('./bookings'));

if (process.env.NODE_ENV === 'production') {
    const path = require('path');

    // Serve the frontend index
    router.get('/', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());

        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });

    // Serve the static assets
    router.use(express.static(path.resolve('../frontend/build')));

    // Serve the frontend index at all routes that are not api routes
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());

        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'build', 'index.html')
        );
    });
}

module.exports = router;
