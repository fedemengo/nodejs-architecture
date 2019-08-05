const router = require('express').Router();
const logger = require('../utils/logger')('src/routes/data.js');

module.exports = controller => {
    router.use((req, res, next) => {
        logger.network(
            `Received request: ${req.method} ${req.baseUrl}${req.path}`
        );
        next();
    });

    router.post('/insert', controller.insertData);

    router.get('/retrieve', controller.retrieveData);

    router.get('/health', (req, res, next) =>
        res.json({ message: 'OK' }).end()
    );

    return router;
};

module.exports._inject = ['data-controller'];
