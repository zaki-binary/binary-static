var URL = require('../../url');

var element = {
    amountFor10: '#amount_for_10',
    durationInput: '#duration_amount',
    durationUnitsSelect: '#duration_units',
    payoutInput: '#amount',
    getPricesButton: '#bet_calculate',
    purcahseButton: '#btn_buybet_10',
    tradeRaisesValue: '#units_for_10',
    betCalculationPanel: '#bet_calculation_container',
    betConfirmationPanel: '#bet_confirm_wrapper',
    riseFallTab: '#bets_tab_risefall',
    underlyingSymbolSelect: '#bet_underlying',
    amountTypeSelect: '#amount_type'
};

module.exports = {

    "palceRandomTrade2": function (browser) {
        browser
            .url(browser.launch_url + URL.TRADE.RANDOM)
            .click(element.riseFallTab)
            .pause(1000)
            .setValue(element.underlyingSymbolSelect, 'R_25')
            .waitForElementVisible(element.amountFor10, 5000)
            .setValue(element.durationInput, 100)
            .setValue(element.durationUnitsSelect, 'days')
            .setValue(element.amountTypeSelect, 'payout')
            .setValue(element.payoutInput, '20')
            .click(element.getPricesButton)
            .waitForElementVisible(element.betCalculationPanel)
            .assert.containsText(element.tradeRaisesValue, '5')
            .click(element.purcahseButton)
            .waitForElementVisible(element.betConfirmationPanel)
            .assert.containsText(element.betConfirmationPanel, 'Trade Confirmation')
        .end();
    }
};