module.exports.randomStr = function(length, initChars) {
    var chars = initChars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        str = '';
    for (var i = length; i > 0; --i) {
        str += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return str;
};