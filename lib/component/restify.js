/**
 * Server middleware module
 *
 * @module middleware
 *
 * @date 4/18/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var colors = require('colors');
var restify = require('restify');
// var path = require('path');
var blueprint = require('./blueprint');
// var passport = require('./passport');

var rest = {};
rest.restify = undefined;

rest.lift = function(server, done) {
    var config = server.options;
    if (config.port) {
        if (!server.restify) {
            // Create server
            var serv = restify.createServer({
              name: config.name || '',
              version: config.version || ''
            });
            server.restify = serv;

            // Server init
            serv.use(restify.acceptParser(serv.acceptable));
            serv.use(restify.queryParser());
            serv.use(restify.bodyParser());
            serv.get('/', function(req, res, next) {
                res.send('Hello server.');
                next();
            });

            // Server init from plugin
            initPlugins(server, config);

            // Server blueprint routes
            blueprint(server, config);

            // Start server
            serv.listen(config.port || 8080, function () {
                server.logger.info('Restify'.magenta, config.port);
                server.restify = serv;
                done();
            });

        } else {
            blueprint(server, config);
            done();
        }
    } else {
        done();
    }
}

rest.lower = function(server, done) {
    var config = server.options;
    if (config.port) {
        if (server.restify) {
            server.restify.close(function() {
                done();
            });
        } else {
            done();
        }
    } else {
        done();
    }
}

// init plugin restify server
var initPlugins = function(server, config) {
    if (config.plugins) {
        for (var pluginName in config.plugins) {
            var plugin = config.plugins[pluginName];

            if (plugin.hooks && plugin.hooks.restify) {
                plugin.hooks.restify(server, plugin);
            }
        }
    }
}


// Register server routes
// require('../route')(server);

// Host static app
// if (config.app.path) {
//     server.get(/.*/, restify.serveStatic({
//         directory: path.join(__dirname, '..', config.app.path),
//         default: 'index.html'
//     }));
// }


module.exports = rest;
