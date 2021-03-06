/**
 * Plugin test module
 *
 * @module test
 *
 * @date 5/21/16
 * @author Fang Jin <fang-a.jin@db.com>
 */
require('./bootstrap');

var path = require('path');
var fixturePath = path.join(__dirname, 'fixture');

var config = {
    port: options.port,
    debug: 'verbose',
    mongo: 'mongodb://localhost/test',
    app: fixturePath,
    // model: '',
    // controller: '',
    // scheduler: '',
    prefix: '/v1',
    routes: {
        get: {
            path: '/get',
            GET: httpCall,
        },
        blog: {},
    },
    schedules: {},
    plugger: '/plugin',
    plugins: {
        plugin: {
            app: fixturePath,
            // model: '',
            // controller: '',
            prefix: '/v1',
            routes: {
                get: {
                    path: '/get',
                    GET: httpCall,
                },
                ctrl: {
                    path: '/ctrl',
                    controller: 'index',
                    GET: 'index',
                },
                plugin: {},
            },
            // scheduler: '',
            schedules: {
                plugin: {
                    once: 'in 2 minutes'
                }
            }
        },
        // passport: {},
        local: {}
    }
};

describe("Plugin", function(){

    before(function(done) { server.lift(config, done); });
    // after(function(done) { server.lower(done); });

    it("should route main GET", function(done) {
        var route = config.prefix + config.routes.get.path;
        request.get(route).expect(200, done);
    });

    it("should route plugin GET", function(done) {
        var plugin = config.plugins.plugin;
        var route = plugin.prefix + plugin.routes.get.path;
        request.get(route).expect(200, done);
    });

    it("should route plugin controller GET", function(done) {
        var plugin = config.plugins.plugin;
        var route = plugin.prefix + plugin.routes.ctrl.path;
        request.get(route).expect(200, done);
    });

    it("should query main model", function(done) {
        var route = config.prefix + '/blog';
        request.get(route).expect(200, done);
    });

    it("should query plugin model", function(done) {
        var plugin = config.plugins.plugin;
        var route = plugin.prefix + '/plugin';
        request.get(route).expect(200, done);
    });

    it("should run plugin schedule", function(done) {
        server.agenda.jobs({ name: 'plugin'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(1);
            done();
        });
    });

    it("should query local plugin model", function(done) {
        var plugin = config.plugins.local;
        var route = plugin.prefix + '/local';
        request.get(route).expect(200, done);
    });

    it("should run local plugin schedule", function(done) {
        server.agenda.jobs({ name: 'local'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(1);
            done();
        });
    });

    // it("should return status false before login", function(done) {
    //     var route = config.prefix + '/status';
    //     request.get(route).send({}).expect(200, function(err, result) {
    //         if (err) return done(err);
    //         expect(result.body).to.be(false);
    //         done();
    //     });
    // });

});
