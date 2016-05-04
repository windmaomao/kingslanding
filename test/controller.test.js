/**
 * Controller test module
 *
 * @module test
 *
 * @date 4/21/16
 * @author Fang Jin <fang-a.jin@db.com>
 */
require('./bootstrap');

var config = {
    port: options.port,
    controller: '../../test/fixture',
    routes: {
        /**
         * GET call with controller
         */
        ctrl: {
            path: '/ctrl',
            controller: 'index',
            GET: 'index',
        },
        /**
         * REST call with controller
         */
        rest: {
            path: '/rest',
            controller: 'rest',
            REST: ['query', 'detail']
        },
        /**
         * Group call with controller
         */
        group: {
            path: '/group',
            controller: 'index',
            items: {
                'index': {
                    path: '',
                    GET: 'index'
                },
                'debug': {
                    path: '/debug',
                    POST: 'debug'
                },
                'rest': {
                    path: '/rest',
                    REST: ['query', 'detail']
                }
            }
        },
    }
};

describe("Controller", function(){

    before(function(done) {
        server.lift(config, done);
    });

    after(function(done) {
        server.lower(done);
    });

    it("should route controller GET", function(done) {
        var route = config.routes.ctrl;
        request.get(route.path).expect(200, done);
    });

    it("should route controller REST query", function(done) {
        var route = config.routes.rest;
        request.get(route.path).expect(200, done);
    });

    it("should route controller REST insert if defined", function(done) {
        var route = config.routes.rest;
        request.post(route.path).expect(405, done);
    });

    it("should route controller group GET", function(done) {
        var group = config.routes.group;
        var route = group.items.index;
        request.get(group.path + route.path).expect(200, done);
    });

    it("should route controller group POST", function(done) {
        var group = config.routes.group;
        var route = group.items.debug;
        request.post(group.path + route.path).expect(200, done);
    });

    it("should route controller group REST query", function(done) {
        var group = config.routes.group;
        var route = group.items.rest;
        request.get(group.path + route.path).expect(200, done);
    });

    it("should route controller group REST insert if defined", function(done) {
        var group = config.routes.group;
        var route = group.items.rest;
        request.post(group.path + route.path).expect(405, done);
    });

});
