// backend/routes/api/index.js
const router = require('express').Router();

const sessionRouter = require('./session');
const usersRouter = require('./users');

const { restoreUser } = require('../../utils/auth');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.get('/test', function (req, res) {
    res.json({ message: 'Looks like the API is running.' });
});

router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});

module.exports = router;
