/**
 * Passport test module
 *
 * @module test
 *
 * @date 4/30/16
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
    passport: 'local',
    routes: {
        user: {},
        blog: {}
    }
};
var request = require('supertest')('http://localhost:' + config.port);

describe("Passport", function(){

    before(function(done) {
        server.lift(config, done);
    });

    after(function(done) {
        server.lower(done);
    });

    it("should route model query", function(done) {
        request.get('/blog').expect(200, done);
    });

    it("should route model insert", function(done) {
        request.post('/blog').send({}).expect(201, done);
    });

    it("should return status false before login", function(done) {
        request.get('/status').send({}).expect(200, done);
    });

    it("should fail to authenticate if no user matches", function(done) {
        var user = { username: 'root', password: 'root' };
        request.post('/login').send(user).expect(401, done);
    });

    it("should authenticate if user matches", function(done) {
        var user = { username: 'fang', password: 'fang' };
        var User = server.models.user;
        User.update({ username: 'fang'}, user, {upsert: true}, function(err) {
            if (err) { return done(err); }
            request.post('/login').send(user).expect(200, done);
        });
    });

});
