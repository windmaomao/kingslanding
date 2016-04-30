/**
 * Passport module
 *
 * @module route
 * @requires controller
 * @requires lodash

 * @date 4/28/16
 * @author Fang Jin <windmaomao@gmail.com>
 */

var passport = require('passport');

module.exports = function(server, config) {
    var prefix = config.prefix || '';
    var strategyCode = config.passport;
    var serv = server.restify;

    if (strategyCode == 'local') {
        var cookieParser = require('cookie-parser');
        var session = require('cookie-session');
        var LocalStrategy = require('passport-local').Strategy;

        serv.use(cookieParser());
        serv.use(session({keys: ['abc']}));
        serv.use(passport.initialize());
        serv.use(passport.session());

        var User = server.models.user;
        passport.use(new LocalStrategy(
            function(username, password, done) {
                User.findOne({ username: username }, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) {
                        return done(null, false);
                    }
                    // if (!user.validPassword(password)) {
                    //   return done(null, false, { message: 'Incorrect password.' });
                    // }
                    // Todo
                    return done(null, user);
                });
            }
        ));
        passport.serializeUser(function(user, done) {
            done(null, user._id);
        });
        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });

        serv.post(prefix + '/login',
        passport.authenticate('local'), function(req, res, next) {
            res.send(req.user);
            next();
        });

        serv.get(prefix + '/register', function(req, res,next) {
            User.register(new User({ username: req.body.username }), req.body.password, function(err, result) {
                if (err) {
                    console.log('fail to register', err);
                    return next(err);
                }
                res.send(result);
                next();
            });
        });

        serv.get(prefix + '/status', function(req, res, next) {
            res.send(req.isAuthenticated());
            next();
        });

        serv.get(prefix + '/logout', function(req, res, next) {
            req.logout();
            res.send();
            next();
        });
    }
};
