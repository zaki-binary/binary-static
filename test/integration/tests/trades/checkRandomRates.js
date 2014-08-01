var URL = require('../../url');
var utils = require('../../utils');

var element = {
    amountFor10: '#amount_for_10',
    unitsFor10: '#units_for_10'
};

module.exports = {

    "checkRandomRates": function (browser) {
        browser
            .url(browser.launch_url + URL.TRADE.RANDOM)
            .waitForElementVisible(element.amountFor10, 5000)
            .assert.containsText(element.unitsFor10, '50')
        .end();
    },
};