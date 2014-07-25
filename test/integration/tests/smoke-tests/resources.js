var utils = require('../../utils');

var urls = [
    { page: 'Asset Index', path: '/c/asset_index.cgi' },
    { page: 'Trading Times', path: '/c/trading_times.cgi' },
    { page: 'Trading Guide', path: '/c/contract_guide.cgi' },
    { page: 'Pricing Table', path: '/c/pricing_table.cgi' },
    { page: 'Rise / Fall Table', path: '/c/rise_fall_table.cgi' }
];

module.exports = utils.smoteTestUrls(urls);