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
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};
