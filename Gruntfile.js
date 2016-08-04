/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.description || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['web/script/<%= pkg.name %>/<%= pkg.name %>.js','web/scripts/<%= pkg.name %>/**/*.js'],
                dest: 'web/dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'web/dist/<%= pkg.name %>.min.js'
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'tgz',
                    archive: 'dist/<%= pkg.name %>.tar.gz'
                },
                files: [
                    {
                        src: ['**', '!dist/**'],
                        dest: 'dist'
                    }
                ]
            }
        },
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            gruntfile: {
                src: 'Gruntfile.js'
            },
            karmafile: {
              src : ['test/karma.conf.js']
            },
            client: {
                src: ['web/scripts/**/*.js', 'test/client/**/*.js']
            },
            server: {
                src: ['app.js', 'routes/**/*.js', 'test/server/**/*.js']
            }
        },
        simplemocha: {
            options: {
                globals: ['should'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'dot'
            },
            codebase: {
                src: '<%= jshint.server.src %>'
            }
        },
        karma: {
            unit: {
                configFile: './test/karma.conf.js'
            }
        },


        jasmine_node: {
            task_name: {
                options: {
                    coverage: {},
                    forceExit: true,
                    match: '.',
                    matchAll: false,
                    specFolders: ['routesTest'],
                    extensions: 'js',
                    specNameMatcher: 'spec',
                    captureExceptions: true,
                    junitreport: {
                        report: false,
                        savePath : './build/reports/jasmine/',
                        useDotNotation: true,
                        consolidate: true
                    }
                },
                src: ['routesTest/**/*.js']
            }
        },


        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            karmafile: {
                files: '<%= jshint.karmafile.src %>',
                tasks: ['jshint:karmafile']
            },
            client: {
                files: '<%= jshint.client.src %>',
                tasks: ['jshint:client', 'karma']
            },
            server: {
                files: '<%= jshint.server.src %>',
                tasks: ['jshint:server', 'simplemocha']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');

    // Customized tasks.
    grunt.registerTask('test',['jshint', 'karma', 'jasmine_node']);
    grunt.registerTask('default', ['jshint', 'simplemocha', 'karma', 'concat', 'uglify','compress']);

};
