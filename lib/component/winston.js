/**
 * Logging middleware module
 * http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
 *
 * @module middleware
 *
 * @date 4/27/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var winston = require('winston');
winston.emitErrs = true;

var logger = false;

module.exports = function(options) {
    if (logger) return logger;
    logger = new winston.Logger({
        transports: [
            new winston.transports.File({
                level: 'verbose',
                filename: options.log || "log",
                handleExceptions: true,
                json: false,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            }),
            new winston.transports.Console({
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });

    logger.stream = {
        write: function(message, encoding){
            logger.info(message);
        }
    };

    logger.verbose('Log: On');

    global.logger = logger;
    return logger;
}
