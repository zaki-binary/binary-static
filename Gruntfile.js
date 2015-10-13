module.exports = function (grunt) {

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        configPath: process.cwd() + '/build',
        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });

    grunt.initConfig({
        jasmine: {
            src: "src/javascript/**/*.js",
            options: {
                vendor: [
                    "src/javascript/lib/*.js",
                    "bower_components/jquery/dist/jquery.js",
                    "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
                ],
                specs: "spec/**/*.js"
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', ['jasmine']);
};
