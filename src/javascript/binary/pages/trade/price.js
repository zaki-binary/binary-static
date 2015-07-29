var Price = (function () {
    'use strict';

    var createProposal = function (typeOfContract) {
        var proposal = {proposal: 1}, underlying = document.getElementById('underlying'),
            submarket = document.getElementById('submarket'),
            contractType = typeOfContract,
            amountType = document.getElementById('amount_type'),
            currency = document.getElementById('currency'),
            payout = document.getElementById('amount'),
            startTime = document.getElementById('date_start'),
            expiryType = document.getElementById('expiry_type'),
            duration = document.getElementById('duration_amount'),
            durationUnit = document.getElementById('duration_units'),
            endDate = document.getElementById('expiry_date'),
            endTime = document.getElementById('expiry_time'),
            highBarrier = document.getElementById('barrier'),
            lowBarrier = document.getElementById('barrier1');

        if (payout) {
            proposal['amount_val'] = payout.value;
        }
        if (amountType) {
            proposal['basis'] = amountType.value;
        }
        if (contractType) {
            proposal['contract_type'] = typeOfContract;
        }
        if (currency) {
            proposal['currency'] = currency.value;
        }
        if (underlying) {
            proposal['symbol'] = underlying.value;
        }

        if (startTime && startTime.value != 'now') {
            proposal['date_start'] = startTime.value;
        }

        if (expiryType && expiryType.value == 'duration') {
            proposal['duration'] = duration.value;
            proposal['duration_unit'] = durationUnit.value;
        } else if (expiryType && expiryType.value == 'endtime') {
            proposal['date_expiry'] = moment.utc(endDate.value + " " + endTime.value + 5).unix();
        }

        if (highBarrier && highBarrier.value) {
            proposal['barrier'] = highBarrier.value;
        }
        if (lowBarrier && lowBarrier.value) {
            proposal['barrier2'] = lowBarrier.value;
        }

        proposal['type'] = 'price';

        return proposal;
    };

    var display = function (details, contractType, spotElement) {
        var type = details['contract_type'],
            position = contractTypeDisplayMapping(type),
            display = contractType[type],
            container = document.getElementById('price_container_' + position),
            description_container = document.getElementById('description_container_' + position),
            currency = document.getElementById('currency'),
            purchase = document.getElementById('contract_purchase_' + position),
            h4 = document.createElement('h4'),
            row = document.createElement('div'),
            description = row.cloneNode(),
            priceId = document.createElement('input'),
            fragment = document.createDocumentFragment();

        while (description_container && description_container.firstChild) {
            description_container.removeChild(description_container.firstChild);
        }

        h4.setAttribute('class', 'contract_heading ' + display);
        h4.setAttribute('id', 'contract_heading_' + position);

        description.setAttribute('class', 'contract_description big-col');
        description.setAttribute('id', 'contract_description_' + position);
        row.setAttribute('class', 'row');

        var content = document.createTextNode(display);
        h4.appendChild(content);
        fragment.appendChild(h4);

        if (details['error']) {
            purchase.style.display = 'none';
            content = document.createTextNode(details['error']);
            description.appendChild(content);
            row.appendChild(description);
            fragment.appendChild(row);
        } else {
            var amount = document.createElement('div');

            amount.setAttribute('class', 'contract_amount col');
            amount.setAttribute('id', 'contract_amount_' + position);

            content = document.createTextNode(currency.value + ' ' + details['ask_price']);
            amount.appendChild(content);

            content = document.createTextNode(details['longcode']);
            description.appendChild(content);

            // create unique id object that is send in response
            priceId.setAttribute('name', 'contract_price_id');
            priceId.setAttribute('class', 'contract_price_id');
            priceId.setAttribute('type', 'hidden');
            priceId.setAttribute('id', details['id']);

            row.appendChild(amount);
            row.appendChild(description);
            row.appendChild(priceId);

            fragment.appendChild(row);

            spotElement.textContent = details['spot'];
        }
        description_container.appendChild(fragment);
        container.insertBefore(description_container, purchase);
    };

    return {
        proposal: createProposal,
        display: display,
    };

})();
