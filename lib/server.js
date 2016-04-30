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

var mongoose = require('./component/mongoose');
var restify = require('./component/restify');
var server = {};
server.lifted = false;
server.options = {};
server.models = {};
// server.mongoose = mongoose;
// server.restify = restify;

server.lift = function(options, done) {
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
        // console.log('Mongoose: ' + 'on'.green);

        restify.lift(server, function(err) {
            if (err) {
                return done(err);
            }
            // console.log('Restify: ' + 'on'.green);
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
        // console.log('Mongoose: ' + 'off'.red);

        restify.lower(server, function(err) {
            if (err) {
                return done(err);
            }
            // console.log('Restify: ' + 'off'.red);
            server.lifted = false;
            done();
        });
    });
};

module.exports = server;
