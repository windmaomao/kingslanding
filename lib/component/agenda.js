/**
 * Agenda middleware module
 *
 * @module middleware
 *
 * @date 5/13/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var agenda = module.exports = {};
var Agenda = require('agenda');
var path = require('path');

agenda.lift = function(server, done) {
    var config = server.options;
    if (config.schedules) {
        if (!server.agenda) {
            server.agenda = new Agenda({ db: { address: config.mongo } });

            logger.info('Agenda: On');

            for (key in config.schedules) {

                var schedule = config.schedules[key];

                if (typeof(schedule.fn) == 'function') {
                    fn = schedule.fn;
                } else {
                    fn = require(path.join(
                        config.scheduler,
                        key + 'Scheduler'
                    ));
                }
                server.agenda.define(key, fn);

                if (!schedule.jobs) {
                    schedule.jobs = [{
                        every: schedule.every,
                        once: schedule.once
                    }];
                }

            }

            server.agenda.on('ready', function() {
                server.agenda.cancel({}, function(err, numRemoved) {
                    for (key in config.schedules) {
                        var schedule = config.schedules[key];

                        for (var i in schedule.jobs) {
                            var item = schedule.jobs[i];

                            var job = server.agenda.create(key, item.data || {});
                            if (item.every) {
                                job.repeatEvery(item.every);
                            }
                            if (item.once) {
                                job.schedule(item.once);
                            }
                            job.save();
                            // logger.info(key, )
                        }
                    }
                });
                server.agenda.start();
                done();
            });
        } else {
            done();
        }
    } else {
        done();
    }
};

agenda.lower = function(server, done) {
    var config = server.options;
    if (config.schedules) {
        if (server.agenda) {
            // server.agenda.cancel({}, done);
            server.agenda.stop(done);
        } else {
            done();
        }
    } else {
        done();
    }
}

module.exports = agenda;
