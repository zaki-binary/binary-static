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
    TradeSocket.send({ contracts_for: underlying });
};

var processContractFormOfferings = function (contracts) {
    'use strict';

    Contract.details(contracts, Trade.form(), Trade.barrier());

    displayDurations('duration_units', Contract.durations(), Trade.form(), Trade.barrier());

    durationPopulate();

    displayStartDates('date_start', Contract.startDates());
    displayBarriers(Contract.barriers(), Trade.form());

    TradeSocket.send({ payout_currencies: 1 });
};

var processForgetPriceIds = function () {
    'use strict';

    Object.keys(Price.idDisplayMapping()).forEach(function (key) {
        TradeSocket.send({ forget: key });
    });
};

var processPriceRequest = function () {
    'use strict';

    processForgetPriceIds();
    Price.clearMapping();
    for (var typeOfContract in Contract.contractType()[Trade.form()]) {
        if(Contract.contractType()[Trade.form()].hasOwnProperty(typeOfContract)) {
            TradeSocket.send(Price.proposal(typeOfContract));
        }
    }
};
