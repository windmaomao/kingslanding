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
            console.log('Mongo: '.green + config.mongo);
            server.mongoose = mongoose.connect(config.mongo);
            mongoose.connection.on('error',function (err) {
              console.log('Mongoose connection error: ' + err);
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
