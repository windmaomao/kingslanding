global.options = { port: 8085 };
global.server = require('../lib/server.js');
global.expect = require('expect.js');
global.request = require('supertest')('http://localhost:' + options.port);
global.httpCall = function(req, res, next) {
    res.send('Hello server');
    next();
};
