/*
 * attach event to market list, so when client change market we need to update form
 * and request for new Contract details to populate the form and request price accordingly
 */
document.getElementById("contract_market_nav").addEventListener("click", function(e) {
    if (e.target && e.target.nodeName == "LI") {
        sessionStorage.setItem('market', e.target.id);
        marketChangeEvent(e.target.id);
    }
});

var marketChangeEvent = function (market) {
    'use strict';
    processMarketOfferings(Trade.offerings(), market);
};

/*
 * attach event to form list, so when client click on different form we need to update form
 * and request for new Contract details to populate the form and request price accordingly
 */
document.getElementById("contract_form_name_nav").addEventListener("click", function(e) {
    if (e.target && e.target.nodeName == "LI") {
        sessionStorage.setItem('formname', e.target.id);
        contractFormEventChange(e.target.id);
    }
});

var contractFormEventChange = function (formName) {
    'use strict';

    var market = sessionStorage.getItem('market') || 'Forex';

    market = market.charAt(0).toUpperCase() + market.substring(1);

    // pass the original offerings as we don't want to request offerings again and again
    Trade.details(Trade.offerings(), market, formName);

    // change only submarkets and underlyings as per formName change
    displayOptions('submarket',Trade.submarkets());
    displayOptions('underlying', Trade.underlyings());

    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // get the contract details based on underlying as formName has changed
    TradeSocket.send({ contracts_for: underlying, type: 'contracts_for' });
};

/*
 * attach event to underlying change, event need to request new contract details and price
 */
document.getElementById("underlying").addEventListener("change", function(e) {
    if (e.target) {
        sessionStorage.setItem('underlying', e.target.value);
        underlyingEventChange(e.target.value);
    }
});

var underlyingEventChange = function (underlying) {
    'use strict';
    TradeSocket.send({ contracts_for: underlying, type: 'contracts_for'  });
};

/*
 * bind event to change in duration amount, request price
 */
document.getElementById('duration_amount').addEventListener('input', function (e) {
    processPriceRequest();
});

/*
 * bind event to change in duration units, populate duration and request price
 */
document.getElementById('duration_units').addEventListener('change', function () {
    durationPopulate();
    processPriceRequest();
});


/*
 * attach event to expiry time change, event need to request new price
 */
document.getElementById("expiry_type").addEventListener("change", function(e) {
    if(e.target && e.target.value == 'endtime') {
        var current_moment = moment().add(5, 'minutes').utc();
        document.getElementById('expiry_date').value = current_moment.format('YYYY-MM-DD');
        document.getElementById('expiry_time').value = current_moment.format('HH:mm')
    }
    processPriceRequest();
});


/*
 * attach event to change in amount, request new price only
 */
 document.getElementById("amount").addEventListener('input', function(e) {
     processPriceRequest();
 });
