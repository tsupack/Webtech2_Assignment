const winston = require('winston');
const appRoot = require('app-root-path');
const {splat, combine, timestamp, printf} = winston.format;

// Defines the custom settings for each transport (file and console).
const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
    }
    ,
    console: {
        level: 'debug',
        handleExceptions: true,
    },
};

const myFormat = printf(({timestamp, level, message, meta}) => {
    return `Time : ${timestamp} ; Level: ${level} ; Message: ${message} ; ${meta ? JSON.stringify(meta) : ''}`;
});

// Instantiates a new Winston Logger with the settings defined above.
const logger = winston.createLogger({
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:MM:SS'}),
        splat(),
        myFormat
    ),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;