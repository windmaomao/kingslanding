/**
 * Model test module
 *
 * @module test
 *
 * @date 4/28/16
 * @author Fang Jin <fang-a.jin@db.com>
 */
require('./bootstrap');

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

describe("Restify", function(){

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
