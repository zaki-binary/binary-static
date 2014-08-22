module.exports = {

    javascript: {
        options: {
            format: 'json_flat',
            pretty: true
        },
        files: [
            { dest: 'dist/app.json', src: ['src/javascript/**/*.js', '!src/javascript/external/**/*.js'] },
            { dest: 'dist/lib.json', src: ['src/javascript/external/**/*.js'] }
        ]
    }
};
