module.exports = {
    dist: {
        options: {
            sassDir: 'src/sass',
            cssDir: 'dist/css',
            specify: 'src/sass/binary.scss',
            noLineComments: true,
            outputStyle: 'expanded',
            environment: 'production'
        }
    },
    dev: {
        options: {
            sassDir: 'src/sass',
            cssDir: 'dist/css',
            specify: 'src/sass/external/grid.scss',
            noLineComments: true,
            outputStyle: 'expanded'
        }
    }
};