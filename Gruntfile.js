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
    //
    //grunt.initConfig({
    //    jasmine: {
    //        src: "src/javascript/binary/common/*.js",
    //        options: {
    //            vendor: [
    //                "src/javascript/lib/moment/*.js",
    //                "src/javascript/lib/jquery.js",
    //                "src/javascript/lib/jquery-ui.js",
    //                "src/javascript/lib/jasmine-jquery.js"
    //            ],
    //            specs: "spec/**/*.js"
    //        }
    //    }
    //});
   // grunt.loadNpmTasks('grunt-contrib-jasmine');
   // grunt.registerTask('default', ['jasmine']);
};
