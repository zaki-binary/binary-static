var processMarketOfferings = function (offerings, market) {
    'use strict';

    // populate the Offerings object
    Offerings.details(offerings, market.charAt(0).toUpperCase() + market.substring(1));

    // display markets, submarket, underlyings corresponding to market selected
    displayListElements('contract_market_nav', Offerings.markets(), market);
    displayListElements('contract_form_name_nav', Object.keys(Offerings.contractForms()));
    displayOptions('submarket',Offerings.submarkets());
    displayUnderlyings();

    // get the underlying selected
    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // get the contract details based on underlying as market has changed
    TradeSocket.send({ contracts_for: underlying });
};

var processContractFormOfferings = function (contracts) {
    'use strict';

    Contract.details(contracts);

    displayDurations();

    displayStartDates();

    displayBarriers();

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
    for (var typeOfContract in Contract.contractType()[Offerings.form()]) {
        if(Contract.contractType()[Offerings.form()].hasOwnProperty(typeOfContract)) {
            TradeSocket.send(Price.proposal(typeOfContract));
        }
    }
};
