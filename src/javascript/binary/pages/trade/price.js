var Price = (function () {

    var createProposal = function () {
        var proposal = {proposal: 1}, underlying = document.getElementById('underlying'),
            submarket = document.querySelector('#submarket'),
            contractType = document.querySelector('#contract_type'),
            amountType = document.querySelector('#amount_type'),
            currency = document.querySelector('#currency'),
            payout = document.querySelector('#amount'),
            startTime = document.querySelector('#date_start'),
            expiryType = document.querySelector('#expiry_type'),
            duration = document.querySelector('#duration_amount'),
            durationUnit = document.querySelector('#duration_units'),
            endDate = document.querySelector('#expiry_date'),
            endTime = document.querySelector('#expiry_time'),
            highBarrier = document.querySelector('#barrier'),
            lowBarrier = document.querySelector('#barrier1');

        if (payout) {
            proposal['amount_val'] = payout.value;
        }
        if (amountType) {
            proposal['basis'] = amountType.value;
        }
        if (contractType) {
            proposal['contractType'] = contractType.value;
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

    return {
        proposal: createProposal
    };

})();
