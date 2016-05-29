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
    debug: 'verbose',
    mail: 'smtps://user%40gmail.com:pass@smtp.gmail.com',
    mongo: 'mongodb://localhost/test',
    model: __dirname,
    controller: __dirname,
    passport: 'local',
    routes: {
        user: {},
        blog: {}
    },
    plugger: __dirname,
    plugins: {
        // comment: {}
    }
}
