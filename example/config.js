/**
 * Config module
 *
 * @module config
 *
 * @date 4/27/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

module.exports = {
    port: 8085,
    mongo: 'mongodb://localhost/test',
    model: __dirname,
    controller: __dirname,
    routes: {
        blog: {}
    }
}
