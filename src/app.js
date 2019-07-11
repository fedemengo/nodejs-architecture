const express = require('express');

/**
 * Middleware
 */
const { global } = require('./controllers/middleware');

/**
 * Routers
 */
const { root, cars, users, chat } = require('./routes');

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
        await app.get('firebase').test();
    } catch (e) {}

    app.use(global());

    app.use('/', root);
    app.use('/users', users);
    app.use('/cars', cars);
    app.use('/chat', chat);
});

app.on('shutdown', () => {
    app.use(global.shutdown);
    logger.info('Shutting down app');
});

module.exports = app;
