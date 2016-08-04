module.exports = function(config) {
    config.set({
        basepath: '.',
        frameworks: ['jasmine'],
        // list of file patterns to load in the browser
        // order of the dependencies is important!
        files: [
            '../web/libs/jquery/dist/jquery.min.js',
            '../web/libs/bootstrap/dist/js/bootstrap.min.js',
            '../web/libs/angular/angular.min.js',
            '../web/libs/angular/angular.min.js',
            '../web/libs/angular-bootstrap/ui-bootstrap.min.js',
            '../web/libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
            '../web/libs/angular-cookies/angular-cookies.min.js',
            '../web/libs/angular-mocks/angular-mocks.js',
            '../web/libs/angular-route/angular-route.min.js',
            '../web/libs/angular-sanitize/angular-sanitize.min.js',
            '../web/libs/angular-resource/angular-resource.js',
            '../web/libs/cookies-js/dist/cookies.min.js',
            '../web/libs/alertifyjs/dist/js/alertify.js',
            '../web/libs/fbe-auth/dist/fbe-auth.min.js',
            '../web/libs/fbe-ui-directives/dist/fbe-ui-directives.min.js',
            '../web/libs/fbe-ui-directives/dist/fbe-ui-directives-tpls.js',
            '../web/apps/**/*.js',
            './apps/**/*.js',
            './apps/**/*.jade',
            './routes/**/*.js'



        ],

        preprocessors: {
            '../web/scripts/**/*.js': ['coverage'],
            './client/**/*.coffee': ['coffee']
        },

        // use dots reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots' || 'progress'
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },

        // these are default values, just to show available options

        // web server port
        port: 8089,

        // cli runner port
        runnerPort: 9109,

        //urlRoot = '/__test/';

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // polling interval in ms (ignored on OS that support inotify)
        autoWatchInterval: 0,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari
        // - PhantomJS
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true

    });

};
