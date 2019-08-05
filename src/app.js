const express = require('express');

/**
 * Middleware
 */
const { global } = require('./controllers/middleware');

const app = express();
/**
 * Globals
 */
const logger = require('../src/utils/logger')('src/app.js');

/**
 * Set specific headers when the server is shutting down
 */

app.on('ready', async () => {
    logger.info('App ready');

    try {
        await app.get('mysql').test();
        //await app.get('firebase').test();
    } catch (e) {}

    app.use(global());

    const diContainer = app.get('DI');
    // associate component/dep to a concrete instance
    diContainer.register('database', diContainer.get('mysql'));
    //diContainer.register('database', diContainer.get('firebase'));
    // associate component/deps to its factory
    diContainer.factory('data-service', require('./services/data'));
    diContainer.factory('data-controller', require('./controllers/data'));

    /**
     * Routers
     */
    const { root, data, users, chat } = require('./routes');

    //app.use('/', root);
    app.use('/data', data);
    //app.use('/cars', cars);
    //app.use('/chat', chat);
});

app.on('shutdown', () => {
    app.use(global.shutdown);
    logger.info('Shutting down app');
});

module.exports = app;
