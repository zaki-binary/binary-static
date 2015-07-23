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
