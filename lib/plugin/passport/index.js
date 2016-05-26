/**
 * Passport config module
 *
 * @module route
 * @requires controller
 * @requires lodash

 * @date 5/25/16
 * @author Fang Jin <windmaomao@gmail.com>
 */

var plugin = module.exports = {
    hooks: {}
};

plugin.hooks.restify = function(server, config) {
    var logger = server.logger;

    logger.info('Plugin', 'Passport', 'On');
};
