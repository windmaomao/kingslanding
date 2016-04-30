/**
 * Server test module
 *
 * @module test
 *
 * @date 4/20/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var expect = require('expect.js');
var server = require('../lib/server.js');

describe("Server", function(){

    afterEach(function(done) {
        server.lower(done);
    });

    it("should lift with no settings", function(done) {
        server.lift(null, function(err) {
            expect(err).to.be(undefined);
            expect(server.lifted).to.be.true;
            done();
        });
    });

    it("should lift twice with error", function(done) {
        server.lift(null, function(err) {
            expect(err).to.be(undefined);
            server.lift(null, function(err) {
                expect(err).to.be.a('string');
                done();
            });
        });
    });

    it("should lift with settings stored", function(done) {
        var config = { abc: 1 };
        server.lift(config, function(err) {
            expect(err).to.be(undefined);
            expect(server.options).to.eql(config);
            done();
        })
    });

    it("should lower to terminate", function(done) {
        server.lift(null, function(err) {
            expect(err).to.be(undefined);
            server.lower(function(err) {
                expect(err).to.be(undefined);
                expect(server.lifted).not.to.be.true;
                done();
            });
        });
    });

    it("should be only instance of server", function(done) {
        var config = { abc: 1 };
        server.lift(config, function(err) {
            expect(err).to.be(undefined);
            var server2 = require('../lib/server.js');
            expect(server2.lifted).to.be.true;
            expect(server2.options).to.eql(config);
            done();
        });
    });

    it("should lift mongo", function(done) {
        var config = { mongo: 'mongodb://localhost/test' };
        server.lift(config, function(err) {
            expect(err).to.be(undefined);
            expect(server.mongoose).not.to.be(undefined);
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
