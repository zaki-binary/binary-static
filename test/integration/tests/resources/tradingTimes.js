var URL = require('../../url');
var placeRandomTrade = require('./placeRandomTrade').placeRandomTrade;

var element = {
    forexTab: 'a[href="#tradingtimes-forex"]',
    indicesTab: 'a[href="#tradingtimes-indices"]',
    stocksTab: 'a[href="#tradingtimes-stocks"]',
    commoditiesTab: 'a[href="#tradingtimes-commodities"]',
    sectorsTab: 'a[href="#tradingtimes-sectors"]',
    randomsTab: 'a[href="#tradingtimes-random"]',
    smartIndiciesTab: 'a[href="#tradingtimes-smarties"]'
};

module.exports = {

    "tradingTimes": function (browser) {       

        browser
            .url(browser.launch_url + URL.RESOURCES.TRADING_TIMES)
            .waitForElementVisible('body', 5000)
            .click(forexTab)
            .pause(1000)
            .click(indicesTab)
            .pause(1000)
            .click(stocksTab)
            .pause(1000)
            .click(commoditiesTab)
            .pause(1000)
            .click(sectorsTab)
            .pause(1000)
            .click(randomsTab)
            .pause(1000)
            .click(smartIndiciesTab)
            .pause(1000)
        .end();
    }
};