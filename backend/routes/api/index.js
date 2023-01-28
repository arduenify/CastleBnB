// backend/routes/api/index.js
const router = require('express').Router();

const { restoreUser } = require('../../utils/auth');

router.use(restoreUser);

router.get('/test', function (req, res) {
    res.json({ message: 'Looks like the API is running.' });
});

module.exports = router;
