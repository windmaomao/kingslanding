/**
 * Example
 *
 * @module test
 *
 * @date 4/27/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var env = process.env._ENV || 'config';
var config = require('./' + env + '.js');
var server = require('../lib/server.js');

server.lift(config, function() {
    console.log('Server lifted.');
});
