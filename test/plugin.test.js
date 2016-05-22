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
    // prefix: '/v1',
    plugins: {
        comment: {
            prefix: '/comment',
            routes: {
                get: {
                    path: '/get',
                    GET: httpCall,
                },
            }
        }
    }
};

describe("Controller", function(){

    before(function(done) { server.lift(config, done); });
    // after(function(done) { server.lower(done); });

    it("should route controller GET", function(done) {
        var plugin = config.plugins.comment;
        var route = plugin.prefix + plugin.routes.get.path;
        request.get(route).expect(200, done);
    });

    // it("should route controller REST query", function(done) {
    //     var route = config.routes.rest;
    //     request.get(route.path).expect(200, done);
    // });
    //
    // it("should route controller REST insert if defined", function(done) {
    //     var route = config.routes.rest;
    //     request.post(route.path).expect(405, done);
    // });
    //
    // it("should route controller group GET", function(done) {
    //     var group = config.routes.group;
    //     var route = group.items.index;
    //     request.get(group.path + route.path).expect(200, done);
    // });
    //
    // it("should route controller group POST", function(done) {
    //     var group = config.routes.group;
    //     var route = group.items.debug;
    //     request.post(group.path + route.path).expect(200, done);
    // });
    //
    // it("should route controller group REST query", function(done) {
    //     var group = config.routes.group;
    //     var route = group.items.rest;
    //     request.get(group.path + route.path).expect(200, done);
    // });
    //
    // it("should route controller group REST insert if defined", function(done) {
    //     var group = config.routes.group;
    //     var route = group.items.rest;
    //     request.post(group.path + route.path).expect(405, done);
    // });

});
