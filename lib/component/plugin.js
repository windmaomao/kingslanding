/**
 * Plugin middleware module
 *
 * @module middleware
 *
 * @date 5/26/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var path = require('path');
var _ = require('lodash');

var middleware = module.exports = {};

middleware.lift = function(server, done) {
    var config = server.options;
    if (config.plugins) {
        for (var name in config.plugins) {
            var plugin = config.plugins[name];

            // pluggified if blank
            if (_.isEmpty(plugin)) {
                // find out the plugin folder
                var plugger = config.plugger || __dirname;
                var pluginPath = path.join(plugger, name);

                plugin = config.plugins[name] = require(pluginPath);

                // resolve relative path
                plugin.model = resolveRelativePath(pluginPath, plugin.model);
                plugin.controller = resolveRelativePath(pluginPath, plugin.controller);
                plugin.scheduler = resolveRelativePath(pluginPath, plugin.scheduler);
                // resolve relative prefix
                if (!plugin.prefix) {
                    plugin.prefix = config.prefix;
                } else {
                    plugin.prefix = config.prefix + plugin.prefix;
                }
            }
        }
    }
    // console.log(config.plugins);
    done();
};

middleware.lower = function(server, done) {
    done();
}

var resolveRelativePath = function(root, rel) {
    if (!rel) {
        return root;
    } else {
        return path.join(root, rel);
    }
};
