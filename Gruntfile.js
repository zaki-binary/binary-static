module.exports = function (grunt) {

    require('time-grunt')(grunt);
    //require('grunt-notify')(grunt);

    require('load-grunt-config')(grunt, {
        configPath: process.cwd() + '/build',
        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });
};
