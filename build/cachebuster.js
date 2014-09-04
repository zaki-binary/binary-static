module.exports = {
    cachebuster: {
        options: {
            basedir: 'dist/',
        },
        files: {
            'dist/hashed.json': ['dist/js/binary.min.js', 'dist/js/lib.min.js', 'dist/css/binary.min.css'],
        },
    }
};
