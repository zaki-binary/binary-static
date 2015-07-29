var Contract = (function () {
    'use strict';

    var open, close, contractDetails = [], durations = {}, startDates = [], barriers = {}, contractType = {};

    var processContracts = function (contractObject, formName, barrierCategory, expiryType) {
        var contracts = contractObject.contracts, contractsArray = [], sendAll = true;
        open = contracts['open'];
        close = contracts['close'];

        var formBarrier = getFormNameBarrierCategory(formName);
        formName = formBarrier['formName'];
        barrierCategory = formBarrier['barrierCategory'];

        if (formName) {
            for(var i = 0, len = contracts.available.length; i < len; i++) {
                var currentObj = contracts.available[i];

                if (!durations[currentObj['expiry_type']]) {
                    durations[currentObj['expiry_type']] = {};
                }

                if(!durations[currentObj['expiry_type']][currentObj['contract_category']]) {
                    durations[currentObj['expiry_type']][currentObj['contract_category']] = {};
                }

                if(!durations[currentObj['expiry_type']][currentObj['contract_category']][currentObj['barrier_category']]) {
                    durations[currentObj['expiry_type']][currentObj['contract_category']][currentObj['barrier_category']] = {};
                }

                if(!durations[currentObj['expiry_type']][currentObj['contract_category']][currentObj['barrier_category']][currentObj['start_type']]) {
                    durations[currentObj['expiry_type']][currentObj['contract_category']][currentObj['barrier_category']][currentObj['start_type']] = {};
                }

                durations[currentObj['expiry_type']][currentObj['contract_category']][currentObj['barrier_category']][currentObj['start_type']]['max_contract_duration'] = currentObj['max_contract_duration'];

                durations[currentObj['expiry_type']][currentObj['contract_category']][currentObj['barrier_category']][currentObj['start_type']]['min_contract_duration'] = currentObj['min_contract_duration'];

                if(formName == currentObj['contract_category']) {
                    if (expiryType) {
                        if (expiryType == currentObj['expiry_type']) {
                            contractsArray.push(currentObj);
                        }
                    } else {
                        contractsArray.push(currentObj);
                    }
                    sendAll = false;
                }

                if (currentObj.forward_starting_options && currentObj['start_type'] == 'forward') {
                    startDates = currentObj.forward_starting_options;
                }

                if (formName == currentObj['contract_category']) {
                    var barrier = {};
                    if (currentObj.barriers == 1) {
                        if (!barriers.hasOwnProperty(currentObj['contract_category'])) {
                            barrier['count'] = 1;
                            barrier['barrier'] = currentObj['barrier'];
                            barrier['barrier_category'] = currentObj['barrier_category'];
                            barriers[formName] = barrier;
                        }
                    } else if (currentObj.barriers == 2) {
                        if (!barriers.hasOwnProperty(currentObj['contract_category'])) {
                            barrier['count'] = 2;
                            barrier['barrier'] = currentObj['high_barrier'];
                            barrier['barrier1'] = currentObj['low_barrier'];
                            barrier['barrier_category'] = currentObj['barrier_category'];
                            barriers[formName] = barrier;
                        }
                    }

                    if (!contractType[currentObj['contract_category']]) {
                        contractType[currentObj['contract_category']] = {};
                    }

                    if (!contractType[currentObj['contract_category']].hasOwnProperty(currentObj['contract_type'])) {
                        contractType[currentObj['contract_category']][currentObj['contract_type']] = currentObj['contract_display'];
                    }

                }

                if (barrierCategory && barriers && barriers[formName] && !barriers[formName][barrierCategory] ) {
                    barriers = {};
                }
            }

            if(expiryType) {
                var obj = {};
                obj[expiryType] = durations[expiryType];
                durations = obj;
            }

            if (barrierCategory) {
                var j = contractsArray.length;
                while (j--) {
                    if (barrierCategory != contractsArray[j]['barrier_category']) {
                        contractsArray.splice(j, 1);
                    }
                }
            }
        }

        if (sendAll) {
            contractDetails = contracts.available;
        } else {
            contractDetails = contractsArray;
        }
    };

    var details = function (contractObject, formName, expiryType) {
        processContracts(contractObject, formName, expiryType);
    };

    return {
        details: details,
        open: function () { return open; },
        close: function () { return close; },
        contracts: function () { return contractDetails; },
        durations: function () { return durations; },
        startDates: function () { return startDates; },
        barriers: function () { return barriers; },
        contractType: function () { return contractType; }
    };

})();
