/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message = (function () {
    'use strict';

    var process = function (msg) {
        var response = JSON.parse(msg.data);
        console.log(response);
        if (response) {
            var type = response.msg_type;

            if (type === 'offerings') {
                sessionStorage.setItem('offerings', msg.data);
                processMarketOfferings();
            } else if (type === 'contracts_for') {
                processContractFormOfferings(response);
                hideOverlayContainer();
            } else if (type === 'payout_currencies') {
                displayCurrencies(response);
                processPriceRequest();
            } else if (type === 'proposal') {
                Price.display(response, Contract.contractType()[Offerings.form()], document.getElementById('spot'));
                hidePriceLoadingIcon();
            } else if (type === 'open_receipt') {
                Purchase.display(response);
            }
        } else {
            console.log('some error occured');
        }
    };

    return {
        process: process,
    };

})();
