/**
 * Model test module
 *
 * @module test
 *
 * @date 4/28/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var expect = require('expect.js');
var server = require('../lib/server.js');
var httpCall = function(req, res, next) {
    res.send('Hello server');
    next();
};
var config = {
    port: 8085,
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
var request = require('supertest')('http://localhost:' + config.port);

describe("Model", function(){

    before(function(done) {
        server.lift(config, done);
    });

    after(function(done) {
        server.lower(done);
    });

    it("should route rest controller GET", function(done) {
        request.get('/rest').expect(200, done);
    });

    it("should route model query", function(done) {
        request.get('/blog').expect(200, done);
    });

    it("should route model insert", function(done) {
        request.post('/blog').send({}).expect(201, done);
    });

});
