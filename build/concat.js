module.exports = {
    all: {
        options: {
            separator: ';',
        },
        files: {
            'dist/js/lib.js': [
                'src/javascript/external/jquery.js', 
                'src/javascript/external/highstock/highstock.js', 
                'src/javascript/external/moment/moment.js', 
                 'src/javascript/external/**/*.js'
             ],
            'dist/js/binary.js': ['src/javascript/**/*.js', '!src/javascript/external/**/*.js']
        }
    }
};
