(function() {
    'use strict';

    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        mustache = require('mustache'),
        properties = require('../properties').getProperties();

    /**
     * Creates a synthetic JavaScript file using a mustache template
     * exposing the current user profile.
     *
     * @param {express.Request} req - the request.
     * @param {express.Response} res - the response.
     */
    exports.profile = function(req, res) {
        var filePath = path.resolve(__dirname, '../templates/profile.mustache');
        fs.readFile(filePath, {encoding: 'utf8'}, function(err, template) {
            if (!err) {
                var user = util.format('%j', req.user);
                var buffer = new Buffer(mustache.render(template, {user: user}), 'utf8');

                res.set({
                    'Content-Type': 'application/javascript',
                    'Content-Length': buffer.length
                });
                res.send(200, buffer);
            } else {
                res.send(404);
            }
        });
    };

    /**
     * Creates a synthetic JavaScript file using a mustache template
     * exposing the list of facilities for the current environment.
     *
     * @param {express.Request} req - the request.
     * @param {express.Response} res - the response.
     */
    exports.facilities = function(req, res) {
        var filePath = path.resolve(__dirname, '../templates/facilities.mustache');
        fs.readFile(filePath, {encoding: 'utf8'}, function(err, template) {
            if (!err) {
                var facilities = util.format('%j', getFacilities(req.ip));
                var buffer = new Buffer(mustache.render(template, {facilities: facilities}), 'utf8');
                res.set({
                    'Content-Type': 'application/javascript',
                    'Content-Length': buffer.length
                });
                res.send(200, buffer);
            } else {
                res.send(404);
            }
        });
    };

    /**
     * Gets the facilities for the current request.
     *
     * @param {string} ipAddress - the request ip address.
     * @return {Object[]} - the list of facilities.
     */
    function getFacilities(ipAddress){
        return properties.facilities.map(function(facility){
            var copy = JSON.parse(JSON.stringify(facility));
            if (ipAddress && ipAddress.indexOf(facility.ipPrefix) === 0) {
                copy.recommended = true;
            }
            return copy;
        });
    }

})();
