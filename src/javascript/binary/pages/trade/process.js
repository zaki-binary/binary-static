var processMarketOfferings = function () {
    'use strict';

    var market = sessionStorage.getItem('market') || 'forex',
        formname = sessionStorage.getItem('formname') || 'risefall',
        offerings = sessionStorage.getItem('offerings');

    // populate the Offerings object
    Offerings.details(JSON.parse(offerings), market.charAt(0).toUpperCase() + market.substring(1), formname);

    // display markets, submarket, underlyings corresponding to market selected
    displayListElements('contract_market_nav', Offerings.markets().sort(compareMarkets), market);
    displayListElements('contract_form_name_nav', Object.keys(Offerings.contractForms()).sort(compareContractCategory), formname);
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

    displayDurations('spot');

    displayStartDates();

    displayBarriers();

    processPriceRequest();
};

var processForgetPriceIds = function () {
    'use strict';

    Object.keys(Price.idDisplayMapping()).forEach(function (key) {
        TradeSocket.send({ forget: key });
    });
};

var processPriceRequest = function () {
    'use strict';

    showPriceLoadingIcon();
    processForgetPriceIds();
    Price.clearMapping();
    for (var typeOfContract in Contract.contractType()[Offerings.form()]) {
        if(Contract.contractType()[Offerings.form()].hasOwnProperty(typeOfContract)) {
            TradeSocket.send(Price.proposal(typeOfContract));
        }
    }
};
