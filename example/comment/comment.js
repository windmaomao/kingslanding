/**
 * Comment model module
 *
 * @module mongo
 *
 * @date 5/20/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;

module.exports = {
    fields: {
        title: { type: String },
    },
    options: {
        collection: 'comment',
        versionKey: false,
        timestamps: {},
        runValidators: false
    },
    methods: {},
    indexes: {},
    virtuals: {}
}
