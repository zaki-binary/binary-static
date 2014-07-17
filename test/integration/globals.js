function randomStr(length, initChars) {
    var chars = initChars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        str = '';
    for (var i = length; i > 0; --i) {
        str += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return str;
}

module.exports = {
    'default': {
        url: 'https://www.binary-beta.com',
        randomStr: randomStr        
    },
    'production': {
        url: 'https://www.binary.com',
        randomStr: randomStr
    }
};
