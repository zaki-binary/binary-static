var placeRandomTrade = require('./placeRandomTrade').placeRandomTrade;

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

    "checkTradeInPortfolio": function (browser) {
        
        placeRandomTrade(browser);

        browser
            .url(browser.launch_url + URL.ACCOUNT.MY_ACCOUNT)
            .waitForElementVisible('body', 5000)
            .assert.containsText('body', 'USD 20.00 payout if Random 25 Index')            
        .end();
    }
};