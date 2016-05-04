/**
 * Working test module
 *
 * @module test
 *
 * @date 4/28/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

describe("Root", function() {

    describe("Restify", function(){

        var config = {
            port: options.port,
            mongo: 'mongodb://localhost/test',
            model: '../../test/fixture',
            controller: '../../test/fixture',
            routes: {
                rest: {
                    path: '/rest',
                    controller: 'rest',
                    REST: ['query', 'detail']
                },
                blog: {}
            }
        };

        before(function(done) { server.lift(config, done); });
        after(function(done) { server.lower(done); });

        it("should route rest controller GET", function(done) {
            request.get('/rest').expect(200, done);
        });

        it("should route model query", function(done) {
            request.get('/blog').expect(200, done);
        });

        it("should route model insert", function(done) {
            request.post('/blog').send({}).expect(201, done);
        });

        it("should access models", function(done) {
            expect(server.models).not.to.be(undefined);
            done();
        });

        it("should register model blog", function(done) {
            expect(server.models.blog).not.to.be(undefined);
            done();
        });

    });

    describe("Controller", function(){

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

        before(function(done) { server.lift(config, done); });
        after(function(done) { server.lower(done); });

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


});
