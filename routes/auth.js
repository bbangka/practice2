(function() {
    'use strict';

    var util = require('util');

    /**
     * Renders the login page.
     *
     * @param {express.Request} req - the request.
     * @param {express.Response} res - the response.
     */
    exports.login = function(req, res) {
        res.render('auth/login');
    };

    // helper method to look for the 'basePath' local in the response object
    // (which is populated by the xroads proxy middleware if it was used),
    // otherwise returns the standard '/' root base path
    function getApplicationPath(res, relative) {
        var basePath =  (res.locals['basePath'] || '/');
        return relative ? util.format('%s%s', basePath, relative) : basePath;
    }

    /**
     * Redirect user to the login page if not authenticated.
     *
     * @param {express.Request} req - the request.
     * @param {express.Response} res - the response.
     * @param {Function} next - the next handler.
     */
    exports.redirectIfNotAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect(getApplicationPath(res, 'login'));
        }
    };

    /**
     * Redirects to the home page if the user is already authenticated.
     *
     * @param {express.Request} req - the request.
     * @param {express.Response} res - the response.
     * @param {Function} next - the next handler.
     */
    exports.redirectIfAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect(getApplicationPath(res));
        }
        else {
            next();
        }
    };

})();
