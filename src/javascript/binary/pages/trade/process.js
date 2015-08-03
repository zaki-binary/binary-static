/*
 *
 */
var processMarketOfferings = function (offerings, market) {
    'use strict';

    // populate the Trade object
    Trade.details(offerings, market.charAt(0).toUpperCase() + market.substring(1));

    // display markets, submarket, underlyings corresponding to market selected
    displayListElements('contract_market_nav', Trade.markets());
    displayListElements('contract_form_name_nav', Object.keys(Trade.contractForms()));
    displayOptions('submarket',Trade.submarkets());
    displayOptions('underlying', Trade.underlyings());

    // get the underlying selected
    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // get the contract details based on underlying as market has changed
    TradeSocket.send({ contracts_for: underlying, type: 'contracts_for' });
};

var processContractFormOfferings = function (contracts) {
    'use strict';

    Contract.details(contracts, Trade.form(), Trade.barrier());

    displayDurations('duration_units', Contract.durations(), Trade.form(), Trade.barrier());

    durationPopulate();

    displayStartDates('date_start', Contract.startDates());
    displayBarriers(Contract.barriers(), Trade.form());

    TradeSocket.send({ currencies: 1, type: "currencies" });
};

var processForgetPriceIds = function () {
    var priceIds = Object.keys(Price.idDisplayMapping());
    for (var i = 0, len = priceIds.length; i < len; i++) {
        TradeSocket.send({ forget: priceIds[i] });
    }
};

var processPriceRequest = function () {
    processForgetPriceIds();
    Price.clearMapping();
    for (var typeOfContract in Contract.contractType()[Trade.form()]) {
        if(Contract.contractType()[Trade.form()].hasOwnProperty(typeOfContract)) {
            TradeSocket.send(Price.proposal(typeOfContract));
        }
    }
};
