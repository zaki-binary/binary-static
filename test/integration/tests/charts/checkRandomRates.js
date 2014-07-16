module.exports = {

    "checkRandomRates": function (browser) {
        browser
            .url('https://www.binary.com/c/trade.cgi?l=EN&market=random')
            .waitForElementVisible('body', 5000)
            .click('a[href=#tab_graph]')
            .waitForElementVisible('#live_chart_div', 5000)
            .click('.live_charts_stream_button[data-live=10min]')            
        .end();
    },
};