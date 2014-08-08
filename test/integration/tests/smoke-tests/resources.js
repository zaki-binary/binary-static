var utils = require('../../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Asset Index', path: URL.RESOURCES.ASSET_INDEX },
    { page: 'Trading Times', path: URL.RESOURCES.TRADING_TIMES },
    { page: 'Trading Guide', path: URL.RESOURCES.TRADING_GUIDE },
    { page: 'Pricing Table', path: URL.RESOURCES.PRICING_TABLE },
    { page: 'Rise / Fall Table', path: URL.RESOURCES.RISE_FALL_TABLE }
];

module.exports = utils.smokeTestUrls(urls);