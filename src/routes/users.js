const router = require('express').Router();

module.exports = () => {
    router.get('/', (req, res, next) => {
        res.json({ message: 'respond with a resource' }).end();
    });

    return router;
};

//module.exports._inject = [];
