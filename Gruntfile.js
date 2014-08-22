module.exports = function (grunt) {
    
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: require('./package.json'),
    });   

    //
    
    grunt.registerTask('css', ['compass', 'autoprefixer', 'cssmin', 'uncss']);    
    grunt.registerTask('js', ['concat', 'uglify']);    
    grunt.registerTask('default', ['clean', 'css', 'js', 'hash', 'fileindex', 'copy']);    
    grunt.registerTask('dev', ['default', 'connect:dev']);    
    grunt.registerTask('deploy', ['default', 'gh-pages', 'watch']);    
    grunt.registerTask('custom', ['default', 'connect:dev']);    
    grunt.registerTask('test', ['jshint']);  
};
