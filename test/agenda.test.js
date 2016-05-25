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
    debug: 'verbose',
    mongo: 'mongodb://localhost/test',
    controller: '../../test/fixture',
    scheduler: '../../test/fixture',
    schedules: {
        function: {
            every: '1 seconds',
            fn: function(job, done) {
                run.heartbeat = true;
                console.log('heartbeating ...');
                done();
            }
        },
        heartbeat: {
            priority: 'high',
            every: '1 minutes',
        },
        heartbeatOnce: {
            priority: 'low',
            once: 'in 1 minutes',
        },
        heartbeatJobs: {
            concurrency: 1,
            jobs: [
                {
                    data: { a: 1 },
                    every: '5 minutes'
                },
                {
                    data: { b: 1 },
                    once: 'in 1 minutes'
                }
            ]
        }
    },
    plugins: {
        plugin: {
            scheduler: '../../test/fixture',
            schedules: {
                plugin: {
                    once: 'in 2 minutes'
                }
            }
        }
    }
};

describe("Agenda", function(){

    before(function(done) { server.lift(config, done); });
    // after(function(done) { server.lower(done); });

    it("should launch scheduling process", function(done) {
        expect(server.agenda).not.to.be(undefined);
        done();
    });

    it("should register schedules", function(done) {
        server.agenda.jobs({}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(6);
            done();
        });
    });

    it("should run schedule heartbeat with function", function(done) {
        expect(run.function).to.be.true;
        done();
    });

    it("should run schedule repeat from scheduler", function(done) {
        server.agenda.jobs({ name: 'heartbeat'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(1);
            done();
        });
    });

    it("should run schedule repeat with high priority", function(done) {
        server.agenda.jobs({ name: 'heartbeat'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs[0].attrs.priority).to.be(10);
            done();
        });
    });

    it("should run schedule once from scheduler", function(done) {
        server.agenda.jobs({ name: 'heartbeatOnce'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(1);
            done();
        });
    });

    it("should run schedule once with low priority", function(done) {
        server.agenda.jobs({ name: 'heartbeatOnce'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs[0].attrs.priority).to.be(-10);
            done();
        });
    });

    it("should run schedule jobs from scheduler", function(done) {
        server.agenda.jobs({ name: 'heartbeatJobs'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(2);
            jobs.map(function(job) {
                expect(job.attrs.data).not.to.be(undefined);
            });
            done();
        });
    });

    it("should run schedule once from plugin", function(done) {
        server.agenda.jobs({ name: 'plugin'}, function(err, jobs) {
            if (err) return done(err);
            expect(jobs.length).to.be(1);
            done();
        });
    });

});
