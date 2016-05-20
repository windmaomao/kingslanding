/**
 * Server test module
 *
 * @module test
 *
 * @date 4/20/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

require('./bootstrap');

after(function(done) { server.lower(done); });

describe("Server", function(){

    it("should lift with no settings", function(done) {
        server.lift(null, function(err) {
            expect(err).to.be(undefined);
            expect(server.lifted).to.be.true;
            done();
        });
    });

    it("should lift restify", function(done) {
        var config = { port: 8085 };
        server.lift(config, function(err) {
            expect(err).to.be(undefined);
            expect(server.restify).not.to.be(undefined);
            done();
        });
    });
});

describe("Route", function(){

    var config = {
        port: 8085,
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
            }
        }
    };

    before(function(done) { server.lift(config, done); });

    it("should ping entry page", function(done) {
        request.get('/').expect(200, done);
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

    it("should route controller GET", function(done) {
        var route = config.routes.ctrl;
        request.get(route.path).expect(200, done);
    });

});
