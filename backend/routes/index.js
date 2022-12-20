const express = require('express');
const router = express.Router();

// Add a XSRF-TOKEN cookie
// Will be allowed in production until frontend implemented later on
router.get('/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();

    res.cookie('XSRF-TOKEN', csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken,
    });
});

router.use('/api', require('./api'));
router.use('/users', require('./users'));
router.use('/spots', require('./spots'));

module.exports = router;
