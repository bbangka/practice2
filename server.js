var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    flash = require('connect-flash'),
    passport = require('passport'),
    routes = require('./routes'),
    auth = require('./routes/auth'),
    synthetic = require('./routes/synthetic'),
    search = require('./routes/search'),
    properties = require('./properties').getProperties(),
    ldap = require('fbe-ldap'),
    proxy = require('fbe-proxy');

require('express-namespace');

var Application = function() {

    var self = this;

    /**
     * Set up server properties and configuration variables.
     */
    function setupVariables() {
        self.ports = properties.port;
        self.hostname = properties.hostname;
        self.apis = properties.apis;
        self.prefix = properties.proxyPrefix;
        self.cookieOptions = properties.cookieOptions;
        self.proxies = Object.keys(self.apis)
            .reduce(function(proxies, key){
                proxies[key] = proxy.proxy(self.apis[key]);
                return proxies;
            },{});
    }

    /**
     * Creates terminator handler.
     *
     * @param {string=} sig - signal to terminate on.
     */
    function terminator(sig) {
        return function() {
            if (typeof sig === 'string') {
                console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
                process.exit(1);
            }
            console.log('%s: Node server stopped.', Date(Date.now()));
        };
    }

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    function setupTerminationHandlers() {
        //  Process on exit and signals.
        process.on('exit', terminator());

        var signals = [
            'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL',
            'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE',
            'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'];

        signals.forEach(function(signal) {
            process.on(signal, terminator(signal));
        });
    }

    /**
     * Configures the express application server.
     */
    function configureServer() {
        self.app = express();
        // all environments
        self.app.set('views', path.join(__dirname, 'web/apps'));
        self.app.set('view engine', 'jade');
        self.app.set('trust proxy', 'true');
        self.app.use(express.favicon());
        self.app.use(express.logger('dev'));
        self.app.use(express.json());
        self.app.use(express.urlencoded());
        self.app.use(express.methodOverride());
        self.app.use(express.responseTime());

        ldap.use(new ldap.LDAPRouter(self.cookieOptions));
        self.app.use(express.cookieParser(self.cookieOptions.secret));
        self.app.use(express.cookieSession(self.cookieOptions.session));
        self.app.use(flash());
        self.app.use(passport.initialize());
        self.app.use(passport.session());
        self.app.use(proxy.xroads(self.prefix));
        self.app.use(ldap.checkSession);
        self.app.use(express.static(path.join(__dirname, 'web')));
        self.app.use(self.app.router);

        // development only
        if ('development' === self.app.get('env')) {
            self.app.use(express.errorHandler());
            self.app.locals.pretty = true;
        }

        passport.use(new ldap.LDAPStrategy());
    }

    /**
     * Create the routing table entries + handlers for the application.
     *
     */
    function createRoutes() {

        //ensures user is already authenticated
        var authenticated = ldap.authenticated;

        self.app.get('/', auth.redirectIfNotAuthenticated, routes.index);

        //authentication
        self.app.get('/login', auth.redirectIfAuthenticated, auth.login);
        self.app.post('/login', ldap.login);
        self.app.post('/logout', ldap.logout);

        //search route
        self.app.get('/search', search.doSearch);

        //partial views
        self.app.get('/product-data-ui/*', authenticated, routes.partials);

        //this is just an example of how to get your current user data
        //delete this endpoint
        self.app.get('/user', authenticated, function(req, res){
          res.json(req.user);
        });

        //api proxy redirection
        setupProxyRedirection(authenticated);

        //synthetic/configuration javascript files
        self.app.namespace('/scripts', function(){
            self.app.get('/profile.js', authenticated, synthetic.profile);
            self.app.get('/facilities.js', synthetic.facilities);
        });

        self.app.get('*',auth.redirectIfNotAuthenticated, routes.index);
    }

    function setupProxyRedirection(authenticated){
        self.app.all(
            '/merchv3/*', authenticated,
            patchApiCallUrl(self.proxies['merch'], self.apis['merch'], '/merchv3')
        );

        self.app.all(
            '/media/*', authenticated,
            patchApiCallUrl(self.proxies['media'], self.apis['media'], '/media')
        );

        self.app.all(
            '/wms/*', authenticated,
            patchApiCallUrl(self.proxies['wms'], self.apis['wms'], '/wms')
        );

        self.app.all(
            '/content/*', authenticated,
            patchApiCallUrl(self.proxies['content'], self.apis['content'], '/content')
        );

        self.app.all(
            '/mat/*', authenticated,
            patchApiCallUrl(self.proxies['mat'], self.apis['mat'], '/mat')
        );

        self.app.all(
            '/content-sizing/*', authenticated,
            patchApiCallUrl(self.proxies['sizing'], self.apis['sizing'], '/content-sizing')
        );

        self.app.all(
            '/content-integration/*', authenticated,
            patchApiCallUrl(self.proxies['contentIntegration'], self.apis['contentIntegration'], '/content-integration')
        );

    }

    function patchApiCallUrl(proxyFunc, api, clientPrefix) {
        return function (req, res) {
            if (req.url.indexOf(clientPrefix) === 0) {
                req.url = req.url.slice(clientPrefix.length);
                req.url = '/' + api.baseUrl + req.url;
            }
            proxyFunc(req, res);
        };
    }

    /**
     * Loads the https certificate data.
     */
    function loadCertificates(){
        return {
            key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'))
        };
    }

    /**
     * Starts the application server.
     */
    self.start = function() {
        var httpsOptions = loadCertificates();
        var ports = self.ports;
        var hostname = self.hostname;

        console.log("Starting with environment: " + properties.name);

        // launch the https server
        https.createServer(httpsOptions, self.app).listen(ports['https'], hostname, function() {
            console.log('%s: Node server started on https://%s:%d ...', Date(Date.now() ), 'localhost', ports['https']);
        });

        // launch http the server
        http.createServer(self.app).listen(ports['http'], hostname, function() {
            console.log('%s: Node server started on http://%s:%d ...', Date(Date.now() ), 'localhost', ports['http']);
        });
    };

    //initializes this application.
    setupVariables();
    setupTerminationHandlers();
    configureServer();
    createRoutes();
};

var app = new Application();
app.start();

module.exports = app;




