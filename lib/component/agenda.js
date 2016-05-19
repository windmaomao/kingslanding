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
                logger.verbose('  ' + key + ': every ' + config.schedules[key].frequency);

                var schedule = config.schedules[key];

                // blueprint when schedule is a string
                if (typeof(schedule) == 'string' ) {
                    schedule = config.schedules[key] = {
                        frequency: schedule,
                        fn: key
                    };
                }

                if (schedule.controller) {
                    var controller = require(path.join(
                        config.controller,
                        schedule.controller  + 'Controller'
                    ));
                    fn = controller[schedule.fn];
                } else {
                    if (typeof(schedule.fn) == 'function') {
                        fn = schedule.fn;
                    } else {
                        fn = require(path.join(
                            config.scheduler,
                            schedule.fn + 'Scheduler'
                        ));
                    }
                }
                server.agenda.define(key, fn);
            }

            server.agenda.on('ready', function() {
                server.agenda.cancel({}, function(err, numRemoved) {
                    for (key in config.schedules) {
                        server.agenda.every(config.schedules[key].frequency, key);
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
