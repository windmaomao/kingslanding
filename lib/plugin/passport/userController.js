/**
 * User fixture controller module
 *
 * @module controller
 *
 * @date 4/28/16
 * @author Fang Jin <windmaomao@gmail.com>
 */

var passport = require('passport');

var controller = module.exports = {};

controller.init = function(server, config) {
    var User = server.models.user;
    var prefix = config.prefix || '';
    var serv = server.restify;

    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    serv.post(prefix + '/login',
    passport.authenticate('local'), function(req, res, next) {
        res.send(req.user);
        next();
    });

    serv.get(prefix + '/status', function(req, res, next) {
        if (req.isAuthenticated()) {
            res.send(req.user);
        } else {
            res.send(false);
        }
        next();
    });

};
