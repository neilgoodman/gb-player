'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            build: {
                src: './lib/**/*.js',
                dest: './build/application/app.js',
            },
            debug: {
                src: './lib/**/*.js',
                dest: './debug/application/app.js',
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        nodewebkit: {
            build: {
                options: {
                    platforms: ['win', 'osx'],
                    buildDir: './build/node-webkit',
                },
                src: ['./build/application/**/*']
            }
        },
        copy: {
            build: {
                files: [
                    { dest: './build/application/', src: ['./index.html', './package.json'] },
                    { dest: './build/application/fonts/', src: ['**'], expand: true, filter: 'isFile', cwd: './node_modules/bootstrap/fonts/' }
                ]
            },
            debug: {
                files: [
                    { dest: './debug/application/', src: ['./index.html', './package.json'] },
                    { dest: './debug/application/fonts/', src: ['**'], expand: true, filter: 'isFile', cwd: './node_modules/bootstrap/fonts/' }
                ]
            }
        },
        uglify: {
            build: {
                src: './build/application/app.js',
                dest: './build/application/app.js'
            }
        },
        exec: {
            insecure_chrome: {
                command: 'open -a "Google Chrome" --args --disable-web-security'
            }
        },
        jsdoc : {
            dist : {
                src: './lib/**/*.js', 
                options: {
                    destination: './doc'
                }
            }
        },
        less: {
            build: {
                src: './lib/styles/gb-player.less',
                dest: './build/application/styles.css',
                options: {
                    paths: ['./lib/styles', './node_modules/bootstrap/less'],
                    cleancss: true
                }
            },
            debug: {
                src: './lib/styles/gb-player.less',
                dest: './debug/application/styles.css',
                options: {
                    paths: ['./lib/styles', './node_modules/bootstrap/less'],
                    sourceMap: true
                }
            }
        },
        watch: {
            debug: {
                files: './lib/**/*',
                tasks: ['debug']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['browserify:build', 'less:build', 'uglify:build', 'copy:build', 'nodewebkit:build']);
    grunt.registerTask('debug', ['browserify:debug', 'copy:debug', 'less:debug']);
    grunt.registerTask('debug:watch', ['watch:debug']);
}