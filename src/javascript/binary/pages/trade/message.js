var Message = (function () {
    'use strict';

    var process = function (msg) {
        var response = JSON.parse(msg.data);
        console.log(response);
        if (response) {
            var type = response.msg_type;

            if (type == 'offerings') {
                var market = sessionStorage.getItem('market') || 'Random';
                processMarketOfferings(response, market);
            } else if (type == 'contracts') {
                processContractFormOfferings(response, Offerings.form());
            } else if (type == 'payout_currencies') {
                displayCurrencies(response);
                processPriceRequest();
            } else if (type == 'proposal') {
                Price.display(response, Contract.contractType()[Offerings.form()], document.getElementById('spot'));
            }
        } else {
            console.log('some error occured');
        }
    };

    return {
        process: process,
    };

})();
