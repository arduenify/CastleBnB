// backend/routes/api/index.js
const router = require('express').Router();

const { BadRequestError } = require('../../errors/api');
const { restoreUser } = require('../../utils/auth');

router.use(restoreUser);

router.get('/test', function (req, res) {
    res.json({ message: 'Looks like the API is running.' });
});

router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});

router.get('/bad-request', (req, res, next) => {
    const err = new BadRequestError({
        message: 'This is only used to test bad requests.',
    });

    next(err);
});

module.exports = router;
