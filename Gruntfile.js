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
            src: "src/javascript/binary/**/*.js",
            options: {
                vendor: [
                    "src/javascript/lib/**/*.js"
                ],
                specs: "spec/**/*.js"
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', ['jasmine']);
};
