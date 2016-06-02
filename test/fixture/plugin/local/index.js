/**
 * Passport config module
 *
 * @module route
 * @requires controller
 * @requires lodash

 * @date 5/25/16
 * @author Fang Jin <windmaomao@gmail.com>
 */

module.exports = {
    model: '/model',
    // controller: '',
    // prefix: '',
    routes: {
        local: {}
    },
    // scheduler: '',
    schedules: {
        local: {
            once: 'in 2 minutes'
        }
    },
    hooks: {
        restify: function(server, config) {
            // server.logger.info('Plugin', 'Local', 'On');
        }
    }
};
