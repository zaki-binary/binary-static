module.exports = {

    "checkRandomRates": function (browser) {
        browser
            .url(browser.globals.url + '/c/trade.cgi?market=random')
            .waitForElementVisible('#amount_for_10', 5000)
            .assert.containsText('#units_for_10', '50')
        .end();
    },
};