var utils = require('../../utils');

var urls = [
    { page: 'Forex', path: '/c/trade.cgi?market=forex' },
    { page: 'Indices', path: '/c/trade.cgi?market=indices' },
    { page: 'Stocks', path: '/c/trade.cgi?market=stocks' },
    { page: 'Commodities', path: '/c/trade.cgi?market=commodities' },
    { page: 'Sectors', path: '/c/trade.cgi?market=sectors' },
    { page: 'Randoms', path: '/c/trade.cgi?market=random' },
    { page: 'Smart Indices', path: '/c/trade.cgi?market=smarties' },
    { page: 'Tick Trades', path: '/d/tick_trades.cgi' }
];

module.exports = utils.smoteTestUrls(urls);