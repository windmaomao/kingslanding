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
    drop: true,
    model: '../../test/fixture',
    controller: '../../test/fixture',
    passport: 'local',
    routes: {
        user: {},
        blog: {}
    }
};
var supertest = require('supertest');
var request = supertest.agent('http://localhost:' + config.port);
var user = { username: 'root', password: 'root' };

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
        request.get('/status').send({}).expect(200, function(err, result) {
            if (err) return done(err);
            expect(result.body).to.be(false);
            done();
        });
    });

    it("should fail to authenticate if no user matches", function(done) {
        request.post('/login').send(user).expect(401, done);
    });

    it("should register new user", function(done) {
        request.post('/register').send(user).expect(200, done);
    });

    it("should authenticate if user matches", function(done) {
        request.post('/login').send(user).expect(200, done);
    });

    it("should return status true after login", function(done) {
        request.get('/status').send({}).expect(200, function(err, result) {
            if (err) return done(err);
            expect(result.body).to.be(true);
            done();
        });
    });

});
