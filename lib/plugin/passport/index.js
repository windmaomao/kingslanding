/**
 * Passport config module
 *
 * @module route
 * @requires controller
 * @requires lodash

 * @date 5/25/16
 * @author Fang Jin <windmaomao@gmail.com>
 */

var colors = require('colors');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
// var LocalStrategy = require('passport-local').Strategy;

var plugin = module.exports = {
    prefix: '/',
    routes: {
        user: {}
    },
    hooks: {}
};

plugin.hooks.restify = function(server, config) {
    var logger = server.logger;
    logger.info('Plugin'.magenta, 'Passport', 'On');

    var strategyCode = config.passport || 'local';
    if (strategyCode == 'local') {
        server.logger.info('Passport'.magenta, strategyCode);

        var serv = server.restify;
        serv.use(cookieParser());
        serv.use(session({keys: ['abc']}));
        serv.use(passport.initialize());
        serv.use(passport.session());

        // Todo: migrate to controller
        // function loggedIn(req, res, next) {
        //     if (req.isAuthenticated()) {
        //         return next();
        //     }
        //     return res.send(401);
        // }
        //
        // serv.post(prefix + '/login',
        // passport.authenticate('local'), function(req, res, next) {
        //     res.send(req.user);
        //     next();
        // });
        //
        // serv.post(prefix + '/register', function(req, res,next) {
        //     User.register(new User({ username: req.body.username }), req.body.password, function(err, result) {
        //         if (err) {
        //             // console.log('fail to register', err);
        //             res.send(401, err);
        //             return next();
        //         }
        //         res.send(result);
        //         next();
        //     });
        // });
        //
        // serv.get(prefix + '/status', function(req, res, next) {
        //     if (req.isAuthenticated()) {
        //         res.send(req.user);
        //     } else {
        //         res.send(false);
        //     }
        //     next();
        // });
        //
        // serv.get(prefix + '/logout', function(req, res, next) {
        //     req.logout();
        //     res.send();
        //     next();
        // });
        //
        // serv.get(prefix + '/profile', loggedIn, function(req, res, next) {
        //     res.send(req.user);
        //     next();
        // });
        //
        // serv.post(prefix + '/profile', loggedIn, function(req, res, next) {
        //     var profile = req.body;
        //     var password = profile.password || "";
        //     delete profile.username;
        //     delete profile.password;
        //     User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        //         if (err) return next(err);
        //         // reset password if available
        //         if (password) {
        //             user.setPassword(password, function(err, user2) {
        //                 if (err) return next(err);
        //                 user2.save();
        //                 res.send(user2);
        //                 next();
        //             })
        //         } else {
        //             res.send(user);
        //             next();
        //         }
        //     })
        // });
        //
        // serv.post(prefix + '/password', function(req, res, next) {
        //     var profile = req.body;
        //     req.user.setPassword(profile.password, function(err, user2) {
        //         if (err) return next(err);
        //         user2.save();
        //         res.send(user2);
        //         next();
        //     });
        // })

    }
};
