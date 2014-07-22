var utils = require('../../utils');

var urls = [
    '/c/trade.cgi?market=forex',    
    '/c/trade.cgi?market=indices',
    '/c/trade.cgi?market=stocks',
    '/c/trade.cgi?market=commodities',
    '/c/trade.cgi?market=sectors',
    '/c/trade.cgi?market=random',
    '/c/trade.cgi?market=smarties',
    '/d/tick_trades.cgi'
];

module.exports.smokeBasic = function (browser) {
    utils.openUrls(browser, urls);
};
