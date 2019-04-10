const appRoot = require('app-root-path');
const winston = require('winston');

// Defines the custom settings for each transport (file, console)
const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// Instantiates a new Winston Logger with the settings defined above
const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// Creates a stream object with a 'write' function that will be used by request logger
logger.stream = {
    write: function(message, encoding) {
        // Log level is 'info' so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;