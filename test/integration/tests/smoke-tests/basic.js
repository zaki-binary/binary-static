var utils = require('../../utils');

var urls = [
    { page: 'Home', path: '/' },
    { page: 'Why Us', path: '/why-us' },
    { page: 'Get Started', path: '/get-started' },
    { page: 'Tour', path: '/tour' },
    { page: 'Trade', path: '/c/trade.cgi' },
    { page: 'Contact Us', path: '/c/contact.cgi' }
];

module.exports = utils.smoteTestUrls(urls);