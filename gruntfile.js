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
        concat: {
            production: {
                files: {
                    'public/dist/application.min.js': '<%= applicationJavaScriptFiles %>',
                    'public/dist/lib.min.js': '<%= applicationJavaScriptLibFiles %>'
                }
            }
        },
        ngAnnotate: {
            production: {
                files: {
                    'public/dist/application.min.js': '<%= applicationJavaScriptFiles %>',
                    'public/dist/lib.min.js': '<%= applicationJavaScriptLibFiles %>'
                }
            }
        },
        clean: {
            production: 'public/dist'
        },
        uglify: {
            production: {
                options: {
                    mangle: true
                },
                files: {
                    'public/dist/application.min.js': 'public/dist/application.min.js',
                    'public/dist/lib.min.js': 'public/dist/lib.min.js'
                }
            }
        },
        cssmin: {
            combine: {
                options: {
                    report: 'min',
                    keepSpecialComments: 0
                },
                files: {
                    'public/dist/application.min.css': 'public/css/main.css',
                    'public/dist/lib.min.css': '<%= applicationCSSFiles %>'
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
                    'lang/lang.pot': ['public/modules/**/views/*.html', 'public/modules/**/*.js']
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
        grunt.config.set('applicationJavaScriptLibFiles', config.assets.lib.js);
    	grunt.config.set('applicationCSSFiles', config.assets.lib.css);
    });

    // Default task(s).
    grunt.registerTask('default', ['env:dev', 'dev']);

    // Run dev
    grunt.registerTask('dev', ['jshint', 'scsslint', 'sass' , 'concurrent']);

    // Lint task(s).
    grunt.registerTask('lint', ['jshint', 'scsslint']);

    // Build task(s).
    grunt.registerTask('build', ['clean', 'jshint', 'scsslint', 'loadConfig', 'concat', 'ngAnnotate', 'sass' , 'cssmin']);

    // Dist task(s).
    grunt.registerTask('dist', ['clean', 'loadConfig', 'concat', 'ngAnnotate', 'cssmin']);

    // Run Build task(s).
    grunt.registerTask('runbuild', ['build', 'env:prod', 'concurrent']);

    // Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

    // Extract languages task.
    grunt.registerTask('langextract', ['nggettext_extract:pot']);
    grunt.registerTask('langcompile', ['nggettext_compile']);
};
