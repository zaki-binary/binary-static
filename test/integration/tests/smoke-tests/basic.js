var utils = require('../../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Home', path: URL.HOME },
    { page: 'Why Us', path: URL.WHY_US },
    { page: 'Get Started', path: URL.GET_STARTED },
    { page: 'Tour', path: URL.TOUR },
    { page: 'Trade', path: URL.TRADE.INDEX },
    { page: 'Contact Us', path: URL.CONTACT_US }
];

module.exports = utils.smokeTestUrls(urls);