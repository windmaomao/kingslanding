/**
 * Blueprint module
 * Restful routes
 *
 * @module module

 * @date 4/27/16
 * @author Fang Jin <fang-a.jin@db.com>
 */

var colors = require('colors');
var pa = require('path');
var _ = require('lodash');
var httpMethods = ['GET', 'POST', 'PATCH', 'PUT', 'DEL', 'REST'];
var restMethods = ['query', 'detail', 'insert', 'patch', 'del'];
var restifyMongoose = require('./restify-mongoose');

// http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

// Based on item, prefix and controller
// calculate the route
function getRoute(method, item, prefix, ctrl) {
    var func = item[method];
    if (ctrl) {
        if (method == 'REST') {
            // replace function list by controller rest actions
            _funcs = {};
            _.each(restMethods, function(rm) {
                // skip the method if not defined in the REST array
                if (func.length && (_.indexOf(func, rm) < 0)) {
                    return;
                }
                if (rm in ctrl) {
                    _funcs[rm] = ctrl[rm];
                }
            });
            func = _funcs;
        } else {
            // replace function by controller action
            func = ctrl[func];
        }
    }
    return {
        type: method,
        path: prefix + item.path,
        func: func
    };
}

function _ctrl(path, name) {
    return pa.join(path, name + 'Controller');
}

// config routes
function configRoutes(server, config) {
    var serv = server.restify;
    var logger = server.logger;
    var controllerPath = config.controller;
    var modelPath = config.model;
    var prefix = config.prefix || '';

    var routeGroup = [];
    if (config.routes) {
        if (_.isObject(config.routes)) {
            routeGroup = config.routes;
        } else {
            routeGroup = require(config.routes);
        }
    }

    _.each(routeGroup, function(group, groupName) {
        // build restful routes if restify is enabled
        if (group.restify || !group.path) {
            // assemble REST routes
            group.path = '/' + groupName;
            group.controller = groupName;
            group.REST = [];

            // restify actions from model
            // assign actions to controller
            ctrl = require(_ctrl(controllerPath, group.controller));
            var controller = restifyMongoose(modelPath, groupName);

            global[_.upperFirst(groupName)] =
                global.Models[groupName] =
                server.models[groupName] =
                controller.Model;

            _.each(restMethods, function(m) {
                if (m in controller) {
                    ctrl[m] = controller[m];
                }
            });
        }

        // add routes
        var routes = [];

        // handle default route method
        _.each(httpMethods, function(method) {
            if (method in group) {
                var ctrl = undefined;
                if (group.controller) {
                    ctrl = require(_ctrl(controllerPath, group.controller));
                }
                var route = getRoute(method, group, '', ctrl);
                routes.push(route);
            }
        });

        // handle group route items
        var items = group.items || [];
        _.each(items, function(item, itemName) {
            _.each(httpMethods, function(method) {
                if (method in item) {
                    var ctrl = undefined;
                    if (group.controller) {
                        ctrl = require(_ctrl(controllerPath, group.controller));
                    }
                    var route = getRoute(method, item, group.path, ctrl);
                    routes.push(route);
                }
            });
        });

        // register routes
        _.each(routes, function(route) {
            var url = prefix + route.path;
            logger.verbose('[' + route.type + ']', url);
            switch (route.type) {
                case 'GET':
                    serv.get(url, route.func);
                    break;
                case 'POST':
                    serv.post(url, route.func);
                    break;
                case 'REST':
                    if (route.func.query) {
                        serv.get(url, route.func.query);
                    }
                    if (route.func.insert) {
                        serv.post(url, route.func.insert);
                    }
                    if (route.func.detail) {
                        serv.get(url+'/:id', route.func.detail);
                    }
                    if (route.func.patch) {
                        serv.post(url+'/:id', route.func.patch);
                        serv.patch(url+'/:id', route.func.patch);
                        serv.put(url+'/:id', route.func.patch);
                    }
                    if (route.func.del) {
                        serv.del(url+'/:id', route.func.del);
                    }
                default:
            }
        })
    });
}

module.exports = function(server, config) {
    server.controllers = {};
    global.Models = server.models = {};

    // register main routes
    configRoutes(server, config);

    // register plugin routes
    if (config.plugins) {
        _.each(config.plugins, function(plugin, pluginName) {
            configRoutes(server, plugin);
            logger.info('Routes: ' + pluginName);
        });
    }

    logger.info('Routes: On');
}
