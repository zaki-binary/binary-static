var Price = (function () {

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
            proposal['date_expiry'] = moment.utc(endDate.value + " " + endtime.value).unix();
        }

        if (highBarrier && highBarrier.value) {
            proposal['barrier'] = highBarrier.value;
        }
        if (lowBarrier && lowBarrier.value) {
            proposal['barrier2'] = lowBarrier.value;
        }

        return proposal;
    };

    var display = function (details, contractType, display, position, spotElement, updateSpotFor) {
        var container = document.getElementById('price_container_' + position),
            h4 = document.createElement('h4'),
            row = document.createElement('div'),
            description = row.cloneNode(),
            fragment = document.createDocumentFragment();

        while (container && container.firstChild) {
            container.removeChild(container.firstChild);
        }

        h4.setAttribute('class', 'contract_heading ' + display)
        h4.setAttribute('id', 'contract_heading_' + position)

        description.setAttribute('class', 'contract_description big-col');
        description.setAttribute('id', 'contract_description_' + position);
        row.setAttribute('class', 'row');

        var content = document.createTextNode(display);
        h4.appendChild(content);
        fragment.appendChild(h4);

        if (details['error']) {
            content = document.createTextNode(details['error']);
            description.appendChild(content);
            row.appendChild(description);
            fragment.appendChild(row);
        } else {
            var amount = document.createElement('div'),
                purchase = row.cloneNode(),
                button = document.createElement('button');

            amount.setAttribute('class', 'contract_amount col');
            amount.setAttribute('id', 'contract_amount_' + position);

            purchase.setAttribute('class', 'contract_purchase');
            purchase.setAttribute('id', 'contract_purchase_' + position);
            button.setAttribute('class', 'purchase_button');
            button.setAttribute('value', 'purchase');

            content = document.createTextNode(details['ask_price']);
            amount.appendChild(content);

            content = document.createTextNode(details['longcode']);
            description.appendChild(content);

            row.appendChild(amount);
            row.appendChild(description);

            content = document.createTextNode('Purchase');
            button.appendChild(content);
            purchase.appendChild(button);

            fragment.appendChild(row);
            fragment.appendChild(purchase);
            if (contractType == updateSpotFor) {
                spotElement.textContent = details['spot'];
            }
        }
        container.appendChild(fragment);
    };

    return {
        proposal: createProposal,
        display: display
    };

})();
