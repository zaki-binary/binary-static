var element = {
    startTimeSelect: '#atleast',
    durationAmountInput: '#duration_amount',
    durationUnitsSelect: '#duration_units',
    payoutCurrencySelect: '#bet_currency',
    calculateButton: '#rise_fall_calculate',
    pricingTable: '#rise_fall_prices_div'
};

module.exports = {

    "palceRandomTrade2": function (browser) {
        browser
            .url(browser.launch_url + '/c/rise_fall_table.cgi')
            .click(element.calculateButton)
            .pause(5000)
            .assert.visible(element.pricingTable)
        .end();
    }
};