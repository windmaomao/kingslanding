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

var Tag = colors.magenta('Route');

// Based on item, prefix and controller
// calculate the route
function getRoute(method, item, prefix, ctrl) {
    var func = item[method];
    if (ctrl) {
        if (method === 'REST') {
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
        func: func,
        authenticate: item.authenticate || null
    };
}

function _ctrl(path, name) {
    return pa.join(path, name + 'Controller');
}

function _addRoute(router, method, url, commonFns, fn) {
    var routeFns = _.clone(commonFns, true);
    routeFns.push(fn);
    switch (method) {
        default:
        case 'GET':
            router.get(url, routeFns);
            break;
        case 'POST':
            router.post(url, routeFns);
            break;
        case 'PATCH':
            router.patch(url, routeFns);
            break;
        case 'PUT':
            router.put(url, routeFns);
            break;
        case 'DEL':
            router.del(url, routeFns);
            break;
    }
}

// config routes
function configRoutes(server, config) {
    var serv = server.restify;
    var logger = server.logger;
    var appPath = config.app || '';
    var controllerPath = appPath + (config.controller || '');
    var modelPath = appPath + (config.model || '');
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

            if (ctrl.init) {
                ctrl.init(server, config);
            }
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

        // attach server data middleware
        var attachData = function(req, res, next) {
            req.server = server;
            next();
        };

        // register routes
        _.each(routes, function(route) {
            var type = ('       ' + '[' + route.type + '] ').slice(-7);
            var url = prefix + route.path;
            var urlId = url + '/:id';

            var commonFns = [attachData];
            if (route.authenticate) {
                commonFns.push(route.authenticate);
            }

            switch (route.type) {
                case 'GET':
                case 'POST':
                case 'PUT':
                case 'PATCH':
                case 'DEL':
                    _addRoute(serv, route.type, url, commonFns, route.func);
                    break;
                case 'REST':
                    if (route.func.query) {
                        _addRoute(serv, 'GET', url, commonFns, route.func.query);
                    }
                    if (route.func.insert) {
                        _addRoute(serv, 'POST', url, commonFns, route.func.insert);
                    }
                    if (route.func.detail) {
                        _addRoute(serv, 'GET', urlId, commonFns, route.func.detail);
                    }
                    if (route.func.patch) {
                        _addRoute(serv, 'POST', urlId, commonFns, route.func.patch);
                        _addRoute(serv, 'PATCH', urlId, commonFns, route.func.patch);
                        _addRoute(serv, 'PUT', urlId, commonFns, route.func.patch);
                    }
                    if (route.func.del) {
                        _addRoute(serv, 'DEL', urlId, commonFns, route.func.del);
                    }
                default:
            }
            logger.verbose(Tag, type.green, url);
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
        });
    }

    logger.info(Tag, 'On');
}
