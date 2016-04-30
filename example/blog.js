/**
 * Blog model module
 * Event is sent via system and collected for aggregation.
 *
 * @module mongo
 *
 * @date 4/28/16
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
        collection: 'blog',
        versionKey: false,
        timestamps: {},
        runValidators: false
    },
    methods: {},
    indexes: {},
    virtuals: {}
}
