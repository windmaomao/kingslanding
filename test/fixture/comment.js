/**
 * Comment fixture model module
 *
 * @module mongo
 *
 * @date 5/8/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

module.exports = {
    fields: {
        blogId: { type: ObjectId, ref: 'blog' },
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
    virtuals: {},
    populates: {
        blogId: 'blog'
    }
}
