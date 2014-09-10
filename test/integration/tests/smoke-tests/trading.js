var utils = require('../../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Forex', path: URL.FOREX },
    { page: 'Indices', path: URL.INDICES },
    { page: 'Stocks', path: URL.STOCKS },
    { page: 'Commodities', path: URL.COMMODITIES },
    { page: 'Sectors', path: URL.SECTORS },
    { page: 'Randoms', path: URL.RANDOMS },
    { page: 'Smart Indices', path: URL.SMART_INDICES },
];

module.exports = utils.smokeTestUrls(urls);
