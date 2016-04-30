/**
 * Index fixture controller module
 *
 * @module controller
 *
 * @date 4/28/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

module.exports = {
    index: function(req, res, next) {
        res.send('hello');
        return next();
    },
    debug: function(req, res, next) {
        res.send(req.params);
        return next();
    },
    query: function(req, res, next) {
        res.send('hello');
        return next();
    },
};
