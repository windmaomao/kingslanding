/**
 * User fixture model module
 *
 * @module mongo
 *
 * @date 3/24/16
 * @author Fang Jin <windmaomao@gmail.com>
 */

module.exports = {
    fields: {
        /**
         * Username and password
         */
        username: { type: String, required: true },
        password: { type: String },
        /**
         * Variables
         */
        firstname: String,
        lastname: String,
    },
    options: {
        collection: 'user',
        versionKey: false,
        timestamps: {},
        runValidators: false
    },
    methods: {},
    indexes: {},
    virtuals: {}
}
