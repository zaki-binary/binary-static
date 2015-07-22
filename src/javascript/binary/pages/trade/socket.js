(function () {

    var offerings, market, formName, submarket, underlying, expiryType, startType, barrierCategory;

    var socketConfig = {
        url: "wss://ws.binary.com/websockets/contracts",
        token: 'igwygvy0v338okZMbW0z5-PMt7o',
    };

    var tradeSocket = new WebSocket(socketConfig.url);

    tradeSocket.onopen = function () {
        tradeSocket.send(JSON.stringify({
            authorize: socketConfig.token
        }));

        tradeSocket.send(JSON.stringify({
            offerings: {hierarchy: 1, contracts: 0}
        }));
    };

    tradeSocket.onmessage = function (msg) {
        var response = JSON.parse(msg.data);

        if (response) {
            var type = response.request.type;

            if (type == 'offerings') {
                offerings = response.offerings;

                market = localStorage.getItem('market') || 'Forex';
                formName = localStorage.getItem('formName') || 'risefall';
                submarket = localStorage.getItem('submarket') || '';

                var formAndBarrier = getFormNameBarrierCategory(formName);

                formName = formAndBarrier['formName'];
                barrierCategory = formAndBarrier['barrierCategory'];

                Trade.details(offerings, market, formName, barrierCategory);

                displayListElements('contract_market_nav', Trade.markets());
                displayListElements('contract_form_name_nav', Object.keys(Trade.contractForms()));
                displayOptions('submarket',Trade.submarkets());
                displayOptions('underlying', Trade.underlyings());

                underlying = localStorage.getItem('underlying') || document.getElementById('underlying').value;
                startType = localStorage.getItem('start_type') || '';

                tradeSocket.send(JSON.stringify({
                    contracts_for: underlying
                }));

            } else if (type == 'contracts_for') {
                var formNameElement = document.querySelector('#contract_form_name_nav > li.active');
                if (formNameElement) {
                    formName = formNameElement.id;
                }

                Contract.details(response, formName, barrierCategory);

                displayDurations('duration_units', Contract.durations(), formName, barrierCategory, startType);
                durationPopulate();
                document.querySelector('#duration_units').addEventListener('change', function () {
                    durationPopulate();
                });

                displayStartDates('date_start', Contract.startDates());
                displayBarriers(Contract.barriers(), formName);

                tradeSocket.send(JSON.stringify({
                    currencies: 1
                }));
            } else if (type == 'currencies') {
                displayCurrencies(response);

                tradeSocket.send(JSON.stringify(
                    Price.proposal()
                ));
            } else if (type == 'price') {
                console.log(response);
            }
        } else {
            // need to print error if no response is sent
            console.log('some error occured');
        }
    };

    tradeSocket.onclose = function (e) {
        console.log('socket closed', e);
    };

    tradeSocket.onerror = function (error) {
        console.log('socket error', error);
    };

})();
