var colors = require('colors');

module.exports = function(server, config) {
    server.logger.info('Passport'.magenta, config.passport);
};
