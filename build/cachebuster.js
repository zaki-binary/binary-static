module.exports = {
    cachebuster: {
        options: {
            basedir: 'dist/js/'
        },
        files: {
            'dist/hashed.json': ['dist/js/binary.min.js', 'dist/js/lib.min.js'],
        },
    }
};
