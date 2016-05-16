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
    if (config.schedule) {
        if (!server.agenda) {
            server.agenda = new Agenda({ db: { address: config.mongo } });

            logger.verbose('Agenda: On');

            for (key in config.schedule) {
                logger.verbose('  ' + key + ': every ' + config.schedule[key].frequency);

                var schedule = config.schedule[key];
                if (schedule.controller) {
                    var controller = require(path.join(
                        config.controller,
                        schedule.controller  + 'Controller'
                    ));
                    fn = controller[schedule.fn];
                } else {
                    fn = schedule.fn;
                }
                server.agenda.define(key, fn);
            }

            server.agenda.on('ready', function() {
                server.agenda.cancel({}, function(err, numRemoved) {
                    for (key in config.schedule) {
                        server.agenda.every(config.schedule[key].frequency, key);
                    }
                });
                server.agenda.start();
                done();
            });
        } else {
            done();
        }
    }
};

agenda.lower = function(server, done) {
    var config = server.options;
    if (config.schedule) {
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
