// backend/routes/api/index.js
const router = require('express').Router();

const { restoreUser } = require('../../utils/auth');

router.use(restoreUser);

router.get('/test', function (req, res) {
    res.json({ message: 'Looks like the API is running.' });
});

router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});

module.exports = router;