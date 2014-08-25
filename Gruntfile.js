module.exports = function (grunt) {
<<<<<<< HEAD

    require('time-grunt')(grunt);
    require('grunt-notify')(grunt);
    
    require('load-grunt-config')(grunt, {
        configPath: process.cwd() + '/build',
        loadGruntTasks: { 
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
=======
    // Configurations
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	javascripts: grunt.file.readJSON('javascript.json'),
	clean: {
	    build: {
		src: ['dist'],
	    },
	},
	compass: {
	    dist: {
		options: {
		    sassDir: 'src/sass',
		    cssDir: 'dist/<%= pkg.version %>/css',
		    specify: 'src/sass/binary.scss',
		    noLineComments: true,
		    outputStyle: 'expanded',
		    environment: 'production',
		},
	    },
	    dev: {
		options: {
		    sassDir: 'src/sass',
		    cssDir: 'dist/<%= pkg.version %>/css/',
		    specify: 'src/sass/external/grid.scss',
		    noLineComments: true,
		    outputStyle: 'expanded',
		},
	    },
	},
	cssmin: {
	    combine: {
		files: {
		    'dist/<%= pkg.version %>/css/bomredirect.min.css': ['src/css/bomredirect.css'],
		    'dist/<%= pkg.version %>/css/grid.min.css': ['dist/<%= pkg.version %>/css/external/grid.css'],
		    'dist/<%= pkg.version %>/css/binary.min.css': ['src/css/external/jquery-simplyscroll.css', 'src/css/external/jquery-ui-custom-theme/jquery-ui-1.10.2.custom.css', 'dist/<%= pkg.version %>/css/binary.css']
		},
	    },
	},
        concat: {
            // will be populated in createJavascriptArray function
        },
	uglify: {
	    my_target: {
		options: {
		    sourceMap: true,
		    sourceMapIncludeSources: true,
		},
		files: {
		    'dist/<%= pkg.version %>/js/binary.min.js': ['dist/<%= pkg.version %>/js/binary.js'],
		},
	    },
	},
	copy: {
	    main: {
		files: [
		    {expand: true, src: ['config.json'], dest: 'dist/<%= pkg.version %>/',},
		    {expand: true, src: ['config.json'], dest: 'dist/0.0.0/',},
		    {expand: true, src: ['javascript.json'], dest: 'dist/<%= pkg.version %>/',},
		    {expand: true, src: ['javascript.json'], dest: 'dist/0.0.0/',},
                    {expand: true, cwd: 'src/config/locales/', src: ['**'], dest: 'dist/<%= pkg.version %>/config/locales/'},
                    {expand: true, cwd: 'src/config/locales/', src: ['**'], dest: 'dist/0.0.0/config/locales/'},
		    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/<%= pkg.version %>/images/',},
		    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/0.0.0/images/',},
		    {expand: true, cwd: 'src/downloads/', src: ['**'], dest: 'dist/<%= pkg.version %>/downloads/',},
		    {expand: true, cwd: 'src/downloads/', src: ['**'], dest: 'dist/0.0.0/downloads/',},
		    {expand: true, cwd: 'src/flash/', src: ['**'], dest: 'dist/<%= pkg.version %>/flash/',},
		    {expand: true, cwd: 'src/flash/', src: ['**'], dest: 'dist/0.0.0/flash/',},
                    {expand: true, cwd: 'src/templates/', src: ['**'], dest: 'dist/<%= pkg.version %>/templates/',},
                    {expand: true, cwd: 'src/templates/', src: ['**'], dest: 'dist/0.0.0/templates/',},
		    {expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/images/', src: ['**'], dest: 'dist/<%= pkg.version %>/css/images',},
		    {expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/images/', src: ['**'], dest: 'dist/0.0.0/css/images',},
		    {expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/', src: ['jquery-ui-1.10.2.custom.css'], dest: 'dist/<%= pkg.version %>/css/',},
		    {expand: true, cwd: 'src/css/external/jquery-ui-custom-theme/', src: ['jquery-ui-1.10.2.custom.css'], dest: 'dist/0.0.0/css/',},
		    {expand: true, cwd: 'src/css/fonts/', src: ['**'], dest: 'dist/<%= pkg.version %>/css/fonts'},
		    {expand: true, cwd: 'src/css/fonts/', src: ['**'], dest: 'dist/0.0.0/css/fonts'},
                    {expand: true, cwd: 'dist/<%= pkg.version %>/', src: ['**'], dest: 'dist/0.0.0/',},
		    {expand: true, cwd: 'src/javascript/', src: ['**'], dest: 'dist/<%= pkg.version %>/dev/javascript/',},
		    {expand: true, cwd: 'src/javascript/', src: ['**'], dest: 'dist/0.0.0/dev/javascript/',}
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
                files: ['package.json', 'config.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'config.json'],
                createTag: false,
                push: false,
           },
>>>>>>> e1e871e81f534fb4e842267af522e962dcfcf70d
        },
    });
};
