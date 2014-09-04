module.exports = {
    cachebuster: {
        options: {},
        files: {
            'dist/hashed.json': ['dist/js/binary.min.js', 'dist/js/lib.min.js', 'dist/css/binary.min.css'],
        },
    }
};
