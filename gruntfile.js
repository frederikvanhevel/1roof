'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            serverViews: {
                files: ['app/views/**'],
                options: {
                    livereload: true,
                }
            },
            serverJS: {
                files: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                }
            },
            clientViews: {
                files: ['public/modules/**/views/*.html'],
                options: {
                    livereload: true,
                }
            },
            clientJS: {
                files: ['public/js/**/*.js', 'public/modules/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                }
            },
            clientCSS: {
                files: ['public/css/main.scss', 'public/modules/**/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true,
                }
            }
        },
        jshint: {
            all: {
                src: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc',
            },
            all: {
                src: ['public/modules/**/css/*.css']
            }
        },
        scsslint: {
            all: {
                src: ['public/modules/**/css/*.scss']
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            production: {
                src: ['<%= applicationJavaScriptFiles %>']
            }
        },
        uglify: {
            production: {
                options: {
                    mangle: true
                },
                files: {
                    'public/dist/application.min.js': '<%= applicationJavaScriptFiles %>'
                }
            }
        },
        cssmin: {
            combine: {
                options: {
                    report: 'min'
                },
                files: {
                    'public/dist/application.min.css': 'public/css/main.css'
                }
            }
        },
        htmlmin: {
            production: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                      expand: true,
                      cwd: 'public/modules/',
                      src: ['**/*.html'],
                      dest: 'public/dist/html'
                    },
                ]
            }
        },
        imagemin: {
            production: {
                files: [
                    {
                      expand: true,
                      cwd: 'public/modules/',
                      src: ['**/*.{png,jpg,gif}'],
                      dest: 'public/dist/img'
                    },
                ]
            }
        },
        sass: {
            options: {
                style: 'expanded',
                sourcemap: 'none'
            },
            all: {
                files: { 'public/css/main.css': 'public/css/main.scss' }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                args: ['production'],
                options: {
                    nodeArgs: ['--debug']
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        env: {
            dev: {
                NODE_ENV: 'development'
            },
            prod: {
                NODE_ENV: 'production'
            },
            test: {
                NODE_ENV: 'test'
            }
        },
        mochaTest: {
            src: ['app/tests/**/*.js'],
            options: {
                reporter: 'spec',
                require: 'server.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        nggettext_extract: {
            pot: {
                files: {
                    'lang/lang.pot': ['public/modules/**/views/*.html']
                }
            },
        },
        nggettext_compile: {
            all: {
                files: {
                    'public/translations.js': ['lang/*.po']
                }
            },
        }
    });

    // Load NPM tasks
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // A Task for loading the configuration object
    grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    	var init = require('./config/init')();
    	var config = require('./config/config');

    	grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    	grunt.config.set('applicationCSSFiles', config.assets.css);
    });

    // Default task(s).
    grunt.registerTask('default', ['env:dev', 'dev']);

    // Run dev
    grunt.registerTask('dev', ['jshint', 'scsslint', 'sass' , 'concurrent']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'scsslint']);

    // Build task(s).
    grunt.registerTask('build', ['jshint', 'scsslint', 'loadConfig' , 'uglify' , 'sass' , 'cssmin']);

    // Dist task(s).
    grunt.registerTask('dist', ['loadConfig', 'uglify', 'cssmin', 'htmlmin']);

    // Run Build task(s).
    grunt.registerTask('runbuild', ['env:prod', 'build', 'concurrent']);

    // Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

    // Extract languages task.
    grunt.registerTask('langextract', ['nggettext_extract:pot']);
    grunt.registerTask('langcompile', ['nggettext_compile']);
};
