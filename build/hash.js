module.exports = {

    options: {
        mapping: 'dist/hashed.json',
        srcBasePath: 'src/',
        destBasePath: 'dist/',
        flatten: false,
        hashLength: 8,
        hashFunction: function (source, encoding) {
            return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
        }
    },
    js: {
        src: 'dist/js/*.min.js',
        dest: 'dist/js/'
    },
    css: {
        src: 'dist/css/*.min.css',
        dest: 'dist/css/'
    }
};
