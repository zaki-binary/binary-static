module.exports = {
    all: {
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
    }
};
