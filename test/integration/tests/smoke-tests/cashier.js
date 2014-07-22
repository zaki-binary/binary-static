var utils = require('../../utils');

var urls = [
    '/c/asset_index.cgi',
    '/c/trading_times.cgi',
    '/c/contract_guide.cgi',
    '/c/pricing_table.cgi',
    '/c/rise_fall_table.cgi'    
];

module.exports.smokeBasic = function (browser) {
    utils.openUrls(browser, urls);
};
