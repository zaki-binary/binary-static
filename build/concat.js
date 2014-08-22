module.exports = {
    all: {
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
    }
};
