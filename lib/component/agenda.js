/**
 * Agenda middleware module
 *
 * @module middleware
 *
 * @date 5/13/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var colors = require('colors');
var path = require('path');
var Agenda = require('agenda');

var agenda = module.exports = {};

agenda.lift = function(server, done) {
    var config = server.options;
    if (config.schedules) {
        if (!server.agenda) {
            server.agenda = new Agenda({ db: { address: config.mongo } });

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
                server.agenda.define(key, {
                    priority: schedule.priority || 'normal',
                    concurrency: schedule.concurrency || 1
                }, fn);

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
                            var data = item.data || {};
                            var job = server.agenda.create(key, data);
                            var msg;
                            if (item.every) {
                                job.repeatEvery(item.every);
                                msg = 'every ' + item.every;
                            }
                            if (item.once) {
                                job.schedule(item.once);
                                msg = 'once ' + item.once;
                            }
                            job.save();
                            var display = '[Agenda][' + key + ']';
                            logger.verbose(display.green, msg, data);
                        }
                    }
                });

                server.agenda.start();
                logger.info('Agenda'.magenta, 'On');
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
