const winston = require('winston');
const { format } = winston;
const { combine, printf } = format;

const config = {
    levels: {
        error: 0,
        warn: 1,
        ok: 2,
        info: 3,
        verbose: 5,
        debug: 5
    },
    colors: {
        error: 'red',
        warn: 'magenta',
        ok: 'green',
        info: 'cyan',
        verbose: 'grey'
    }
};

winston.addColors(config.colors);

const logger = fileName => {
    const myFormat = printf(({ level, message, timestamp }) => {
        return `[${level}] "${message}" (in ./${fileName})`;
    });

    return winston.createLogger({
        levels: config.levels,
        format: combine(format.colorize(), myFormat),
        transports: [new winston.transports.Console()]
    });
};

module.exports = logger;
