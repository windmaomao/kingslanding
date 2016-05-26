/**
 * Plugin fixture model module
 *
 * @module mongo
 *
 * @date 5/21/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = {
    fields: {
        title: { type: String },
    },
    options: {
        collection: 'plugin',
        versionKey: false,
        timestamps: {},
        runValidators: false
    },
    methods: {},
    indexes: {},
    virtuals: {},
}
