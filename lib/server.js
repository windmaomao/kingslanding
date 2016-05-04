/**
 * Server module
 *
 * @module server
 *
 * @requires restify
 * @requires path
 * @requires config
 *
 * @date 4/20/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var winston = require('./component/winston');
var mongoose = require('./component/mongoose');
var restify = require('./component/restify');
var server = {};
server.lifted = false;
server.options = {};
server.models = {};
// server.mongoose = mongoose;
// server.restify = restify;

server.lift = function(options, done) {
    server.logger = winston(options);

    if (server.lifted) {
        return done('Server cannot be lifted again.');
    }
    if (options) {
        server.options = options;
    }

    mongoose.lift(server, function(err) {
        if (err) {
            return done(err);
        }
        restify.lift(server, function(err) {
            if (err) {
                return done(err);
            }
            server.lifted = true;
            done();
        });
    });

};

server.lower = function(done) {
    mongoose.lower(server, function(err) {
        if (err) {
            return done(err);
        }
        restify.lower(server, function(err) {
            if (err) {
                return done(err);
            }
            server.lifted = false;
            done();
        });
    });
};

module.exports = server;
