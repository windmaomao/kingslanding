/**
 * Mailer middleware module
 *
 * @module middleware
 *
 * @date 5/16/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var nodemailer = require('nodemailer');
var _ = require('lodash/core');
var mailer = module.exports = {};
var transport = false;

var mailOptions = {
    ignoreTLS: true,
    debug: false,
    from: 'windmaomao@gmail.com',
    to: 'windmaomao@gmail.com',
    subject: 'Hello ✔',
    text: 'Hello world 🐴',
    html: false
};

mailer.send = function(options, done) {
    var mail = _.clone(mailOptions, true);
    mail = _.extend(mail, options);

    if (mail.debug) {
        return done(null, mail);
    } else {
        transport.sendMail(mail, function(error, info){
            if (error) {
                logger.error(error);
                done(error);
            } else {
                done(null, info.response);
            }
        });
    }
};

mailer.lift = function(server, done) {
    var config = server.options;
    var prefix = config.prefix || '';
    if (config.mail) {
        transport = nodemailer.createTransport(config.mail);
        // register globally to send email
        global.Mail = {};
        global.Mail.send = mailer.send;
        // register express route
        server.restify.post(prefix + '/mail', function(req, res, next) {
            return mailer.send(req.params, function(err, result) {
                if (err) return next(err);
                res.send(result);
                next();
            });
        });
        logger.info('Mail: On');
        var type = ('         ' + '[POST] ').slice(-9);
        var url = prefix + '/mail';
        logger.verbose(type.green + url);
    }
    done();
};

mailer.lower = function(server, done) {
    var config = server.options;
    if (config.mail) {
    }
    done();
}

module.exports = mailer;
