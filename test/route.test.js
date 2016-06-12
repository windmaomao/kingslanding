/**
 * Restify test module
 *
 * @module test
 *
 * @date 4/21/16
 * @author Fang Jin <fang-a.jin@db.com>
 */
require('./bootstrap');

var config = {
    port: 8085,
    debug: 'verbose',
    routes: {
        /**
         * GET call
         */
        get: {
            path: '/get',
            GET: httpCall,
        },
        /**
         * POST call
         */
        post: {
            path: '/post',
            POST: httpCall,
        },
        /**
         * Bundle call
         */
        bundle: {
            path: '/bundle',
            GET: httpCall,
            POST: httpCall,
        },
        /**
         * REST call
         */
        rest: {
            path: '/rest',
            REST: {
                query: httpCall,
                detail: httpCall,
                insert: httpCall,
                patch: httpCall,
                del: httpCall
            }
        },
        /**
         * Group call
         */
        group: {
            path: '/group',
            items: {
                get: {
                    path: '/get',
                    GET: httpCall,
                },
                post: {
                    path: '/post',
                    POST: httpCall,
                },
                bundle: {
                    path: '/bundle',
                    GET: httpCall,
                    POST: httpCall,
                },
                rest: {
                    path: '/rest',
                    REST: {
                        query: httpCall,
                    }
                }
            }
        },
        /**
         * Mixed call
         */
        mixed: {
            path: '/mixed',
            items: {
                get: {
                    path: '/get',
                    GET: httpCall
                }
            },
            REST: {
                query: httpCall,
                insert: httpCall,
            }
        },
        /**
         * Server info
         */
        server: {
            path: '/server',
            GET: function(req, res, next) {
                var server = req.server;
                res.send(server.options);
                return next();
            }
        }
    }
};

describe("Route", function(){

    before(function(done) { server.lift(config, done); });
    // after(function(done) { server.lower(done); });

    it("should ping entry page", function(done) {
        request.get('/').expect(200, done);
    });

    it("should route GET", function(done) {
        var route = config.routes.get;
        request.get(route.path).expect(200, done);
    });

    it("should route POST", function(done) {
        var route = config.routes.post;
        request.post(route.path).expect(200, done);
    });

    it("should route Bundle", function(done) {
        var route = config.routes.bundle;
        // request.get(route.path).expect(200, done);
        request.post(route.path).expect(200, done);
    });

    it("should route REST query", function(done) {
        var route = config.routes.rest;
        request.get(route.path).expect(200, done);
    });

    it("should route REST detail", function(done) {
        var route = config.routes.rest;
        request.get(route.path+'/1').expect(200, done);
    });

    it("should route REST insert", function(done) {
        var route = config.routes.rest;
        request.post(route.path).expect(200, done);
    });

    it("should route REST patch", function(done) {
        var route = config.routes.rest;
        request.post(route.path+'/1').expect(200, done);
    });

    it("should route REST del", function(done) {
        var route = config.routes.rest;
        request.del(route.path+'/1').expect(200, done);
    });

    it("should route group GET", function(done) {
        var group = config.routes.group;
        var route = group.items.get;
        request.get(group.path + route.path).expect(200, done);
    });

    it("should route group POST", function(done) {
        var group = config.routes.group;
        var route = group.items.post;
        request.post(group.path + route.path).expect(200, done);
    });

    it("should route group Bundle", function(done) {
        var group = config.routes.group;
        var route = group.items.bundle;
        request.post(group.path + route.path).expect(200, done);
    });

    it("should route group REST query", function(done) {
        var group = config.routes.group;
        var route = group.items.rest;
        request.get(group.path + route.path).expect(200, done);
    });

    it("should route mixed group GET", function(done) {
        var group = config.routes.mixed;
        var route = group.items.get;
        request.get('/mixed').expect(200, done);
    });

    it("should route mixed REST query", function(done) {
        var group = config.routes.mixed;
        request.post(group.path).expect(200, done);
    });

    it("should route carry server parameters", function(done) {
        var group = config.routes.server;
        request.get(group.path).expect(200).end(function(err, result) {
            expect(result.body.port).to.be(config.port);
            done();
        });
    });

});
