module.exports = {
    all: {
        options: {
            sourceMap: true,
            sourceMapIncludeSources: true,
        },
        files: {
            'dist/js/lib.min.js': ['dist/js/lib.js'],
            'dist/js/binary.min.js': ['dist/js/binary.js'],
            'dist/js/data.min.js': ['dist/js/data.js']
        }
    }
};
