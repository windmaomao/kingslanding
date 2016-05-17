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

var mailOptions = {
    ignoreTLS: true,
    debug: false,
    from: 'windmaomao@gmail.com',
    to: 'windmaomao@gmail.com',
    subject: 'Hello ✔',
    text: 'Hello world 🐴',
    html: false
};

mailer.lift = function(server, done) {
    var config = server.options;
    if (config.mail) {
        server.mailer = nodemailer.createTransport(config.mail);

        var send = function(req, res, next) {
            var mail = _.clone(mailOptions, true);
            mail = _.extend(mail, req.params);

            if (mail.debug) {
                res.send(mail);
            } else {
                server.mailer.sendMail(mail, function(error, info){
                    if (error) {
                        console.log(error);
                        res.send({ result: 'fail', error: error });
                    } else {
                        console.log('Message sent: ' + info.response);
                        res.send({
                            result: 'sent',
                            response: info.response
                        });
                    }
                });
            }
            return next();
        }

        server.restify.post('/mail', send);
        logger.verbose('Mail: On');
        var prefix = config.prefix || '';
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
