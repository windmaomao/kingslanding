/**
 * Agenda test module
 *
 * @module test
 *
 * @date 5/13/16
 * @author Fang Jin <fang-a.jin@db.com>
 */
require('./bootstrap');

var run = {
    heartbeat: false
}
var config = {
    port: options.port,
    mongo: 'mongodb://localhost/test',
    controller: '../../test/fixture',
    schedule: {
        heartbeat: {
            frequency: '1 seconds',
            fn: function(job, done) {
                run.heartbeat = true;
                console.log('heartbeating ...');
                done();
            }
        },
        controller: {
            frequency: '1 minutes',
            controller: 'index',
            fn: 'schedule'
        }
    }
};

describe("Agenda", function(){

    before(function(done) { server.lift(config, done); });
    after(function(done) { server.lower(done); });

    it("should launch scheduling process", function(done) {
        expect(server.agenda).not.to.be(undefined);
        done();
    });

    it("should register schedules", function(done) {
        server.agenda.jobs({}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(2);
            done();
        });
    });

    it("should run schedule heartbeat", function(done) {
        expect(run.heartbeat).to.be.true;
        done();
    });

    it("should run schedule controller", function(done) {
        server.agenda.jobs({ name: 'controller'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs[0].agenda._eventsCount).to.be(1);
            expect(jobs[0].attrs.lastFinishedAt).not.to.be(undefined);
            done();
        });
    });


});