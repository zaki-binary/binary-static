module.exports = {
    'default': {
        randomStr: function (length, initChars) {
            var chars = initChars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                str = '';
            for (var i = length; i > 0; --i) {
                str += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            return str;
        }
    },
    'test_env': {
        myGlobal: 'test_global'
    }
};
