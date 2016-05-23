/**
 * Plugin test module
 *
 * @module test
 *
 * @date 5/21/16
 * @author Fang Jin <fang-a.jin@db.com>
 */
require('./bootstrap');

var config = {
    port: options.port,
    mongo: 'mongodb://localhost/test',
    model: '../../test/fixture',
    controller: '../../test/fixture',
    prefix: '/v1',
    routes: {
        get: {
            path: '/get',
            GET: httpCall,
        },
        blog: {},
    },
    plugins: {
        plugin: {
            model: '../../test/fixture',
            controller: '../../test/fixture',
            prefix: '/',
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
            }
        }
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


});
