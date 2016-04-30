/**
 * Example
 *
 * @module test
 *
 * @date 4/27/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var config = require('./config.js');
var server = require('../lib/server.js');

server.lift(config, function() {
    console.log('Server lifted.');
});
