const httpStatus = require('http-status-codes');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const global = () => [
    cors(),
    morgan('dev'),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
    helmet(),
    (req, res, next) => {
        console.log('Test middleware');
        next();
    }
];

const shutdown = (req, res) => {
    res.setHeader('Connection', 'close');
    res.send(
        httpStatus.SERVICE_UNAVAILABLE,
        'Server is in the process of restarting'
    );
};

module.exports = global;
module.exports.shutdown = shutdown;
