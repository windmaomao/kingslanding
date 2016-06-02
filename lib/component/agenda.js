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
var schedules;

var Tag = colors.magenta('Schedule');

// register schedules
function defineSchedules(ag, config) {
    for (key in config.schedules) {
        var schedule = schedules[key] = config.schedules[key];

        if (typeof(schedule.fn) == 'function') {
            fn = schedule.fn;
        } else {
            fn = require(path.join(
                config.app || '' + config.scheduler || '',
                key + 'Scheduler'
            ));
        }
        ag.define(key, {
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
}

agenda.lift = function(server, done) {
    var config = server.options;
    if (config.schedules) {
        if (!server.agenda) {
            server.agenda = new Agenda({ db: { address: config.mongo } });

            schedules = {};

            // define main schedules
            defineSchedules(server.agenda, config);

            // define plugin schedules
            if (config.plugins) {
                for (key in config.plugins) {
                    defineSchedules(server.agenda, config.plugins[key]);
                }
            }

            server.agenda.on('ready', function() {
                server.agenda.cancel({}, function(err, numRemoved) {
                    for (key in schedules) {
                        var schedule = schedules[key];

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
                            logger.verbose(Tag, key.green, msg, data);
                        }
                    }
                    logger.info(Tag, 'On');
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
