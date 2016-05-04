/**
 * Restify mogoose model module
 * Controller generator
 *
 * @module controller
 *
 * @date 4/28/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var pa = require('path');
var mongoose = require('mongoose');
var restifyMongoose = require('restify-mongoose');
var _ = require('lodash');

var RestController = function(path, modelName) {
    // load schema
    var SchemaDef = require(pa.join(path, modelName));
    var Schema = new mongoose.Schema(
        SchemaDef.fields,
        SchemaDef.options
    );

    // add default indexes
    if (SchemaDef.options.timestamps) {
        SchemaDef.indexes.createdAt = true;
    }

    // define model hooks
    if (SchemaDef.hooks) {
        if (SchemaDef.hooks.post) {
            _.each(SchemaDef.hooks.post, function(hook, name) {
                Schema.post(name, hook);
            });
        }
    }

    // define model virtual
    if (SchemaDef.virtuals) {
        _.each(SchemaDef.virtuals, function(virtual, name) {
            Schema.virtual(name).get(virtual);
        });
    }

    // define model index
    _.each(SchemaDef.indexes, function(index, name) {
        var ind = {};
        ind[name] = index;
        Schema.index(ind);
    });

    // define model plugins
    if (SchemaDef.plugins) {
        _.each(SchemaDef.plugins, function(options, name) {
            var pluginName = name;
            if (name == 'passport') {
                pluginName = 'passport-local-mongoose';
            }
            var plugin = require(pluginName);
            Schema.plugin(plugin, options);
        });
    }

    // define model
    var Model;
    if (mongoose.models[modelName]) {
        Model = mongoose.model(modelName);
    } else {
        Model = mongoose.model(modelName,Schema);
    }

    // restify route
    var Rest = restifyMongoose(Model);

    // define route
    return {
        Schema: Schema,
        Model:  Model,
        Rest:   Rest,
        query:  Rest.query(),
        detail: Rest.detail(),
        insert: Rest.insert(),
        patch:  Rest.update(),
        del:    Rest.remove()
    }
}

module.exports = RestController;
