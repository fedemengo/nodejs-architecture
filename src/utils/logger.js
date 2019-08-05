const winston = require('winston');
const { format } = winston;
const { combine, printf } = format;

const config = {
    levels: {
        error: 0,
        warn: 1,
        ok: 2,
        info: 3,
        network: 4,
        debug: 5,
        verbose: 6
    },
    colors: {
        error: 'red',
        warn: 'magenta',
        ok: 'green',
        info: 'cyan',
        network: 'yellow',
        debug: 'grey',
        verbose: 'grey'
    }
};

winston.addColors(config.colors);

const logger = fileName => {
    const myFormat = printf(({ level, message, ...meta }) => {
        return `[${level}] ${message} (in ./${fileName})`;
    });

    return winston.createLogger({
        levels: config.levels,
        format: combine(format.colorize(), myFormat),
        transports: [
            new winston.transports.Console({
                level: 'debug',
                prettyPrint: true
            })
        ]
    });
};

module.exports = logger;
