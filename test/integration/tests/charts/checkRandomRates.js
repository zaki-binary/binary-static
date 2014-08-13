var URL = require('../../../url');
var utils = require('../../utils');

module.exports = {

    "checkRandomRates": function (browser) {
        
        browser
            .url(browser.launch_url + URL.TRADE.RANDOM)
            .waitForElementVisible('body', 5000)
            //.click('a[href=#tab_graph]') // $('#betsBottomPage a:contains("Chart")')
            //.waitForElementVisible('#live_chart_div', 5000)
            //.click('.live_charts_stream_button[data-live=10min]')
        .end();
    },
};