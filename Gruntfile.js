module.exports = function (grunt) {
    // Configurations
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	clean: {
	    build: {
		src: ['dist'],
	    },
	},
	compass: {
	    dist: {
		options: {
		    sassDir: 'src/sass',
		    cssDir: 'dist/css',
		    specify: 'src/sass/binary.scss',
		    noLineComments: true,
		    outputStyle: 'expanded',
		    environment: 'production',
		},
	    },
	    dev: {
		options: {
		    sassDir: 'src/sass',
		    cssDir: 'dist/css/',
		    specify: 'src/sass/external/grid.scss',
		    noLineComments: true,
		    outputStyle: 'expanded',
		},
	    },
	},
        rename: {
            main: {
                files: [
                    { src: ['dist/css/binary.css'], dest: 'dist/css/binary_<%= pkg.version %>.css' }
                ]
            },
        },
	cssmin: {
	    combine: {
		files: {
		    'dist/css/bomredirect.min.css': ['src/css/bomredirect.css'],
		    'dist/css/grid_<%= pkg.version %>.min.css': ['dist/css/external/grid.css'],
		    'dist/css/binary_<%= pkg.version %>.min.css': ['src/css/external/jquery-simplyscroll.css', 'src/css/external/jquery-ui-custom-theme/jquery-ui-1.10.2.custom.css', 'dist/css/binary_<%= pkg.version %>.css']
		},
	    },
	},
	concat: {
	    options: {
		separator: ';',
	    },
	    dist: {
		src: [
		    'src/javascript/external/jquery-2.0.3.min.js',
		    'src/javascript/external/jQuery.XDomainRequest.js',
		    'src/javascript/external/jquery.cookie.js',
		    'src/javascript/external/json2.min.js',
		    'src/javascript/external/moment-2.5.0.min.js',
		    'src/javascript/external/moment-lang-2.5.0.min.js',
		    'src/javascript/external/jquery-ui-1.10.2.min.js',
		    'src/javascript/external/jquery.sparkline.min.js',
		    'src/javascript/external/jquery-simplyscroll-2.0.5.min.js',
		    'src/javascript/external/jquery-scrollto-1.4.3.1-min.js',
		    'src/javascript/external/jquery-slides-1.2.min.js',
		    'src/javascript/external/jstree/jquery.jstree.js',
		    'src/javascript/external/jquery-ui-timepicker/jquery.ui.timepicker.js',
		    'src/javascript/external/eventsource.js',
		    'src/javascript/base/pjax-lib.js',
		    'src/javascript/external/mmenu/jquery.mmenu.min.all.js',
		    'src/javascript/form_validation.js',
		    'src/javascript/base/storage.js',
		    'src/javascript/base/pjax.js',
		    'src/javascript/base/page.js',
		    'src/javascript/base/spot_light.js',
		    'src/javascript/base/menu_content.js',
		    'src/javascript/base/jquery_color_animation.js',
		    'src/javascript/base/markets.js',
		    'src/javascript/base/load_data.js',
		    'src/javascript/base.js',
		    'src/javascript/base/inpage_popup.js',
		    'src/javascript/utility.js',
		    'src/javascript/gtm.js',
		    'src/javascript/components/date_picker.js',
		    'src/javascript/components/date_picker/selected_dates.js',
		    'src/javascript/components/time_picker.js',
		    'src/javascript/pages.js',
		    'src/javascript/pages/bet/bet_form.js',
		    'src/javascript/pages/bet/bet_form/attributes.js',
		    'src/javascript/pages/bet/bet_form/barriers.js',
		    'src/javascript/pages/bet/bet_form/time.js',
		    'src/javascript/pages/bet/bet_analysis.js',
		    'src/javascript/pages/bet/bet_analysis/live_chart.js',
		    'src/javascript/pages/bet/bet_analysis/digit_info.js',
		    'src/javascript/pages/bet/bet_price.js',
		    'src/javascript/pages/bet/pricing_details.js',
		    'src/javascript/pages/bet/bet_sell.js',
		    'src/javascript/pages/bet/tick_trade.js',
		    'src/javascript/pages/bet.js',
		    'src/javascript/pages/client/form.js',
		    'src/javascript/pages/client.js',
		    'src/javascript/pages/chart.js',
		    'src/javascript/pages/pricingtable.js',
		    'src/javascript/pages/statement.js',
		    'src/javascript/pages/selfexclusion.js',
		    'src/javascript/pages/frontend.js',
		    'src/javascript/pages/portfolio.js',
		    'src/javascript/pages/contact.js',
		    'src/javascript/base/on_complete.js',
		    'src/javascript/base/appcache_check.js',
		    'src/javascript/livechart/highstock.js',
		    'src/javascript/livechart/highstock-exporting.js',
		    'src/javascript/livechart/export-csv.js',
		    'src/javascript/livechart/config.js',
		    'src/javascript/livechart/datetime_picker.js',
		    'src/javascript/livechart/indicator.js',
		    'src/javascript/livechart.js',
		    'src/javascript/pages/livechart.js'
		],
		dest: 'dist/js/binary_<%= pkg.version %>.js',
	    },
	},
	uglify: {
	    my_target: {
		options: {
		    sourceMap: true,
		    sourceMapIncludeSources: true,
		},
		files: {
		    'dist/js/binary_<%= pkg.version %>.min.js': ['dist/js/binary_<%= pkg.version %>.js'],
		},
	    },
	},
	copy: {
	    main: {
		files: [
		    {expand: true, src: ['package.json'], dest: 'dist/js/',},
		    {expand: true, cwd: 'src/config/', src: ['CNAME'], dest: 'dist/', filter: 'isFile'},
                    {expand: true, cwd: 'src/config/locales/', src: ['**'], dest: 'dist/config/locales/'},
		    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images/',},
		    {expand: true, cwd: 'src/flash/', src: ['**'], dest: 'dist/flash/',},
                    {expand: true, cwd: 'src/templates/', src: ['**'], dest: 'dist/templates/',},
		    {expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/images/', src: ['**'], dest: 'dist/css/images',},
		    {expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/', src: ['jquery-ui-1.10.2.custom.css'], dest: 'dist/css/',},
		    {expand: true, cwd: 'src/css/fonts/', src: ['**'], dest: 'dist/css/fonts'}
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
	    server: {
		options: {
		    hostname: '127.0.0.1',
		    port: 443,
		    protocol: 'https',
		    base: 'dist',
		    keepalive: true,
		},
	    }
	},
	watch: {
	    options: {
		livereload: true,
	    },
	    scripts: {
		files: ['src/javascript/*.js', 'src/javascript/**/*.js'],
		tasks: ['concat', 'uglify'],
	    },
	    css: {
		files: ['src/sass/*.scss', 'src/sass/**/*.scss'],
		tasks: ['compass', 'cssmin'],
	    },
	},
	jshint: {
	    options: {
	        jshintrc: true,
	        ignores: [
                'src/javascript/external/**/*.js',
                'src/javascript/livechart/export-csv.js',
                'src/javascript/livechart/highstock-exporting.js',
                'src/javascript/livechart/highstock.js',
                'src/javascript/base/pjax-lib.js',
                'src/javascript/base/jquery_color_animation.js',
                'src/javascript/gtm.js'
	        ],
	    },
	    all: [
            'Gruntfile.js',
            'src/javascript/**/*.js'
	    ]
	},	
        bump: {
           options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: false,
                push: false,
           },
        },
        nightwatch: {
            options: {
                settings: {
                    "src_folders": ["test/integration/tests/"]
                },
                "selenium": {
                    "start_process": false,
                    "host": "hub.browserstack.com",
                    "port": 80
                }
            }
        },
        shell: {
            nightwatch: {
                command: 'nightwatch -e chrome,firefox,ie',
                cwd: 'test/integration'
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
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-nightwatch');
    grunt.loadNpmTasks('grunt-shell');

    // Task to be performed
    grunt.registerTask('test', ['jshint']); // + unit tests + nightwatch local
    grunt.registerTask('default', ['clean', 'compass', 'rename', 'cssmin', 'concat', 'uglify', 'copy', 'gh-pages', 'watch']);
};
