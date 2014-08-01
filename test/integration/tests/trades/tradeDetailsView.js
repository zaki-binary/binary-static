var placeRandomTrade = require('./placeRandomTrade').placeRandomTrade;

var element = {
    viewButtons: 'button.open_contract_details',
    portfolioTable: '#portfolio-table',
    sellPopup: '#sell_popup_container',
    sellAtMarketButton: '#sell_at_market'
};

module.exports = {

    "tradeDetailsView": function (browser) {

        placeRandomTrade(browser);

        browser
            .url(browser.launch_url + URL.ACCOUNT.MY_ACCOUNT)
            .waitForElementVisible(element.portfolioTable, 5000)
            .click(element.viewButtons)
            .pause(2000)
            .assert.visible(element.sellPopup)
            .click(sellAtMarketButton)
            .pause(10000)
            .assert.containsText(sellPopup, 'Trade Confirmation')
        .end();
    }
};