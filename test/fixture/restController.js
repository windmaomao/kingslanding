/**
 * REST fixture controller module
 *
 * @module controller
 *
 * @date 4/28/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

module.exports = {
    query: function(req, res, next) {
        res.send('hello');
        return next();
    },
    detail: function(req, res, next) {
        res.send('hello');
        return next();
    },
    insert: function(req, res, next) {
        res.send('hello');
        return next();
    },
    patch: function(req, res, next) {
        res.send('hello');
        return next();
    },
    del: function(req, res, next) {
        res.send('hello');
        return next();
    },
};
