module.exports = {
    
    combine: {
        files: {
            'dist/css/grid.min.css': ['dist/css/external/grid.css'],
            'dist/css/binary.min.css': ['src/css/external/**/*.css', 'dist/css/binary.css']
        },
    }
};