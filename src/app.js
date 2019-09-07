const app = require('express')();
const { forEach } = require('lodash');
/**
 * Middleware
 */
const { global } = require('./controllers/middleware');

/**
 * Globals
 */
const logger = require('../src/utils/logger')('src/app.js');

/**
 * Loaders for connecting to the databases
 */
const {
    db: { mysql, firebase }
} = require('./loaders');

/**
 * App configuration
 */
app.set('DI', require('../src/utils/diContainer'));
app.set('mysql', mysql);
app.set('firebase', firebase);

/**
 * GLobal middleware
 */
app.use(global());
logger.info('Load global middleware');

/**
 * Register and load dependencies
 */
const diContainer = app.get('DI');
// associate component/dep to a concrete instance
diContainer.register('database', mysql);
//diContainer.register('database', diContainer.get('firebase'));
// DATA - associate component/deps to its factory
diContainer.factory('youtube-service', require('./services/youtube'));
diContainer.factory('musicpleer-service', require('./services/musicpleer'));
diContainer.factory('download-controller', require('./controllers/download'));

/**
 * Routers
 */
forEach(require('./routes'), (route, name) => {
    // register route factory
    diContainer.factory(`${name}-route`, route);
    // load component (after injecting dependencies)
    logger.info(`Loading route '/${name}'`);
    app.use(`/${name}`, diContainer.get(`${name}-route`));
});

/**
 * Configuration when the server startup
 */
app.on('ready', async () => {
    logger.info('App ready');

    try {
        await app.get('mysql').test();
        //await app.get('firebase').test();
    } catch (e) {}

    logger.info('App setup done');
    app.use(global.errorHandler());
});

/**
 * Set specific headers when the server is shutting down
 */
app.on('shutdown', () => {
    app.use(global.shutdown());
    logger.info('Shutting down app');
});

module.exports = app;
