module.exports = function (grunt) {
    // Configurations
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        javascripts: grunt.file.readJSON('javascript.json'),
        clean: {
            build: {
                src: 'dist',
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: 'dist/css',
                    specify: 'src/sass/binary.scss',
                    noLineComments: true,
                    outputStyle: 'expanded',
                    environment: 'production'
                },
            },
            dev: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: 'dist/css',
                    specify: 'src/sass/external/grid.scss',
                    noLineComments: true,
                    outputStyle: 'expanded'
                },
            },
        },
        cssmin: {
            combine: {
                files: {
                    'dist/css/grid.min.css': ['dist/css/external/grid.css'],
                    'dist/css/binary.min.css': ['src/css/external/**/*.css', 'dist/css/binary.css']
                },
            },
        },
        concat: {
            options: {
                separator: ';',
            },
            lib: {
                src: ['src/javascript/external/**/*.js'],
                dest: 'dist/js/lib.js'
            },
            app: {
                src: ['src/javascript/**/*.js', '!src/javascript/external/**/*.js'],
                dest: 'dist/js/binary.js'
            }
        },
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                },
                files: {
                    'dist/js/lib.min.js': ['dist/js/lib.js'],
                    'dist/js/binary.min.js': ['dist/js/binary.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, src: ['javascript.json'], dest: 'dist' },
                    { expand: true, cwd: 'src/config/locales/', src: ['**'], dest: 'dist/config/locales/' },
                    { expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images/', },
                    { expand: true, cwd: 'src/downloads/', src: ['**'], dest: 'dist/downloads/' },
                    { expand: true, cwd: 'src/flash/', src: ['**'], dest: 'dist/flash/' },
                    { expand: true, cwd: 'src/templates/', src: ['**'], dest: 'dist/templates/' },
                    { expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/images/', src: ['**'], dest: 'dist/css/images' },
                    { expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/', src: ['*.css'], dest: 'dist/css/' },
                    { expand: true, cwd: 'src/css/fonts/', src: ['**'], dest: 'dist/css/fonts' },
                    { expand: true, cwd: 'src/javascript/', src: ['**'], dest: 'dist/dev/javascript/' }
                ],
            }
        },
        'gh-pages': {
            options: {
                base: 'dist',
                add: true,
                message: 'Auto-generated commit',
            },
            src: ['**'],
        },
        connect: {
            github: {
                options: {
                    hostname: '127.0.0.1',
                    port: 443,
                    protocol: 'https',
                    base: 'dist',
                    keepalive: true
                },
            },
            dev: {
                options: {
                    hostname: '*',
                    port: 8443,
                    protocol: 'https',
                    base: 'dist',
                    keepalive: true,
                    key: grunt.file.read('src/certificates/key/devbin.io.key').toString(),
                    cert: grunt.file.read('src/certificates/crt/devbin.io.crt').toString()
                },
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['javascript/**/*.js'],
                tasks: ['concat', 'uglify'],
            },
            css: {
                files: ['src/sass/**/*.scss'],
                tasks: ['compass', 'cssmin']
            }
        },
        jshint: {
            options: {
                jshintrc: true,
                ignores: 'javascript/external/**/*.js',
            },
            all: 'javascript/**/*.js'
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: false,
                push: false
            }
        },
        shell: {
            nightwatch: {
                command: 'nightwatch',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/integration'
                    }
                }
            },
            browserstack: {
                command: 'nightwatch -c browserstack.json',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/integration'
                    }
                }
            },
            smoke: {
                command: 'nightwatch -g tests/smoke-tests',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/integration'
                    }
                }
            },
            continuous: {
                command: 'nightwatch -t test',
                options: {
                    stderr: false,
                    execOptions: {
                        cwd: 'test/continuous'
                    }
                }
            },
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            single_file: {
                src: 'dist/css/binary.css'
            }
        },
        uncss: {
            dist: {
                options: {
                    ignore: ['#added_at_runtime', /test\-[0-9]+/],
                    media: ['(min-width: 700px) handheld and (orientation: landscape)'],
                    csspath: '../public/css/',
                    raw: 'h1 { color: green }',
                    stylesheets: ['lib/bootstrap/dist/css/bootstrap.css', 'src/public/css/main.css'],
                    ignoreSheets: [/fonts.googleapis/],
                    urls: ['http://localhost:3000/mypage', '...'], // Deprecated
                    timeout: 1000,
                    htmlroot: 'public',
                    report: 'min'
                },
                files: {
                    'dist/css/binary.css': ['app/index.html', 'app/about.html']
                }
            }
        },
        hash: {
            options: {
                mapping: 'dist/hashed.json',
                srcBasePath: 'src/',
                destBasePath: 'dist/',
                flatten: false,
                hashLength: 8,
                hashFunction: function(source, encoding) {
                    return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
                }
            },
            js: {
                src: 'dist/js/*.min.js',
                dest: 'dist/js/'
            },
            css: {
                src: 'dist/css/*.min.css',
                dest: 'dist/css/'
            }
        }
    });

    // load the plugin that will complete the task
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-hash');

    // Tasks to be performed
    grunt.registerTask('default', ['clean', 'compass', 'autoprefixer', 'cssmin', 'concat', 'uglify', 'copy', 'hash']);
    grunt.registerTask('dev', ['default', 'connect:dev']);
    grunt.registerTask('deploy', ['default', 'gh-pages', 'watch']);
    grunt.registerTask('test', ['jshint']); // + unit tests + nightwatch local    
};
