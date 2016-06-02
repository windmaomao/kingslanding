/**
 * Plugin middleware module
 *
 * @module middleware
 *
 * @date 5/26/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var colors = require('colors');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var logger;

var Tag = colors.magenta('Plugin');

var middleware = module.exports = {};

middleware.lift = function(server, done) {
    var config = server.options;
    logger = server.logger;
    if (config.plugins) {
        for (var name in config.plugins) {
            var plugin = config.plugins[name];

            // pluggified if blank
            if (_.isEmpty(plugin)) {
                // find out the plugin folder
                var plugger = (config.app || '') + (config.plugger || '');
                var pluginPath = findPluginPath(name, plugger);

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

                logger.info(Tag, name);
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

var findPluginPath = function(name, plugger) {
    // check plugger path
    var p = path.join(plugger, name);
    logger.debug('Plugger', p);
    if (fs.existsSync(p)) {
        logger.verbose(Tag, name.green, 'matches plugger path');
        return p;
    }

    // check core plugin path
    var p = path.join(__dirname, '../plugin', name);
    logger.debug('Core', p);
    if (fs.existsSync(p)) {
        logger.verbose(Tag, name.green, 'found in core path');
        return p;
    }

    // check module path
    var p = require.resolve(name);
    if (p) {
        logger.verbose(Tag, name.green, 'found in modules');
        return path.dirname(p);
    }
};
