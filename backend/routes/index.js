const express = require('express');
const apiRouter = require('./api');
const router = express.Router();

// Add a XSRF-TOKEN cookie
// Will be allowed in production until frontend implemented later on
router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();

    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken,
    });
});

// API Router
router.use('/api', apiRouter);

module.exports = router;
