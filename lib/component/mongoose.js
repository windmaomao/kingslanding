/**
 * MongoDB server component module
 *
 * @module component
 *
 * @date 4/20/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var colors = require('colors');
var mongoose = require('mongoose');
var mongo = {};

mongo.lift = function(server, done) {
    var config = server.options;
    if (config.mongo) {
        if (!server.mongoose) {
            server.logger.info('Mongo'.magenta, 'On');
            server.mongoose = mongoose.connect(config.mongo, function(err) {
                if (config.drop) {
                    mongoose.connection.db.dropDatabase();
                }
            });
            mongoose.connection.on('error',function (err) {
                server.logger.error('Mongoose connection error: ' + err);
            });
            mongoose.set('debug', function(coll, method, query, doc, options) {
                var q = JSON.stringify(query);
                var op = JSON.stringify(options || {});
                server.logger.debug("Query: %s.%s(%s) %s", coll, method, q, op);
            });
            // mongoose.connection.on('connected', function() {
            //     console.log('Mongoose connection connected.');
            // });
            // mongoose.connection.on('disconnected', function () {
            //   console.log('Mongoose connection disconnected');
            // });
        }
    }
    done();
};

mongo.lower = function(server, done) {
    if (server.mongoose) {
        return mongoose.disconnect(done);
    }
    return done();
    // if (mongoose.connection.readyState) {
    //     return mongoose.disconnect(done);
    // } else {
    //     return done(false);
    // }
};

// process.on('SIGINT', function() {
//   mongoose.connection.close(function () {
//     console.log('Mongoose connection disconnected through app termination');
//     process.exit(0);
//   });
// });

module.exports = mongo;
