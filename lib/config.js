/**
 * Config module
 *
 * @module config
 *
 * @date 3/18/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

module.exports = {
    log: false,
    app: {
        path: '/public',
        route: '/'
    },

    schedule: {
        mongo: 'mongodb://localhost/gmi',
        define: {}
    }
}
