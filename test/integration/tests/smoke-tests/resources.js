var utils = require('../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Asset Index', path: URL.ASSET_INDEX },
    { page: 'Trading Times', path: URL.TRADING_TIMES },
    { page: 'Trading Guide', path: URL.TRADING_GUIDE },
    { page: 'Pricing Table', path: URL.PRICING_TABLE },
    { page: 'Rise / Fall Table', path: URL.RISE_FALL_TABLE }
];

module.exports = utils.smoteTestUrls(urls);