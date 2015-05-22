module.exports = {
    all: {
        options: {
            jshintrc: true,
            ignores: ['src/javascript/lib/**/*.js',
                      'src/javascript/binary/pages/wstrade.js' // wrong and unreasonable jshint issues
                     ]
        },
        src: 'src/javascript/**/*.js'
    }
};
