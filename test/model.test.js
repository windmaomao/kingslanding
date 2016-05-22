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
        blog: {},
        comment: {},
    }
};

describe("Model", function(){

    var blogId, commentId;

    before(function(done) { server.lift(config, done); });
    // after(function(done) { server.lower(done); });

    it("should route rest controller GET", function(done) {
        request.get('/rest').expect(200, done);
    });

    it("should query model", function(done) {
        request.get('/blog').expect(200, done);
    });

    it("should insert model", function(done) {
        request.post('/blog').send({
            title: 'blog title',
        }).expect(201, function(err, result) {
            if (err) return done(err);
            blogId = result.body._id;
            expect(blogId).not.to.be(undefined);
            done();
        });
    });

    it("should access models", function(done) {
        expect(server.models).not.to.be(undefined);
        done();
    });

    it("should register model blog", function(done) {
        expect(server.models.blog).not.to.be(undefined);
        done();
    });

    it("should route referenced model query", function(done) {
        request.get('/comment').expect(200, done);
    });

    it("should insert model with reference", function(done) {
        request.post('/comment').send({
            blogId: blogId,
            title: 'comment title'
        }).expect(201, function(err, result) {
            if (err) return done(err);
            commentId = result.body._id;
            expect(commentId).not.to.be(undefined);
            done();
        });
    });

    it("should populate model reference", function(done) {
        request.get('/comment/' + commentId).expect(200, function(err, result) {
            if (err) return done(err);
            var comment = result.body;
            expect(comment.blog._id).to.be(blogId);
            expect(comment.blogId).to.be(blogId);
            done();
        });
    });

});
