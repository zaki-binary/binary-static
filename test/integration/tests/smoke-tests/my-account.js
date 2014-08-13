var utils = require('../../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Portfolio', path: URL.PORTFOLIO },
    { page: 'Statement', path: URL.STATEMENT },
    { page: 'Password', path: URL.PASSWORD },
    { page: 'Settings', path: URL.SETTINGS },
    { page: 'Affiliate', path: URL.AFFILIATE },
    { page: 'Payment methods', path: URL.PAYMENT_METHODS }
];

module.exports = utils.smokeTestUrls(urls);