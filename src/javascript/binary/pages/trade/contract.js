var Contract = (function () {
    'use strict';

    var open, close, contractDetails = [], durations = {}, startDates = [], barriers = {};

    var processContracts = function (contractObject, formName, expiryType) {
        var contracts = contractObject.contracts_for, contractsArray = [], sendAll = true, barrierCategory;
        open = contracts['open'], close = contracts['close'];

        if (formName) {
            if(formName == 'risefall') {
                formName = 'callput';
                barrierCategory = 'euro_atm';
            } else if (formName == 'higherlower') {
                formName = 'callput';
                barrierCategory = 'euro_non_atm';
            }

            for(var i = 0, len = contracts.available.length; i < len; i++) {
                if (!durations[contracts.available[i]['expiry_type']]) {
                    durations[contracts.available[i]['expiry_type']] = {};
                }

                if(!durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']]) {
                    durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']] = {};
                }

                if(!durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']][contracts.available[i]['barrier_category']]) {
                    durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']][contracts.available[i]['barrier_category']] = {};
                }

                if(!durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']][contracts.available[i]['barrier_category']][contracts.available[i]['start_type']]) {
                    durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']][contracts.available[i]['barrier_category']][contracts.available[i]['start_type']] = {};
                }

                durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']][contracts.available[i]['barrier_category']][contracts.available[i]['start_type']]['max_contract_duration'] = contracts.available[i]['max_contract_duration'];

                durations[contracts.available[i]['expiry_type']][contracts.available[i]['contract_category']][contracts.available[i]['barrier_category']][contracts.available[i]['start_type']]['min_contract_duration'] = contracts.available[i]['min_contract_duration'];

                if(formName == contracts.available[i]['contract_category']) {
                    if (expiryType) {
                        if (expiryType == contracts.available[i]['expiry_type']) {
                            contractsArray.push(contracts.available[i]);
                        }
                    } else {
                        contractsArray.push(contracts.available[i]);
                    }
                    sendAll = false;
                }

                if (contracts.available[i].forward_starting_options && contracts.available[i]['start_type'] == 'forward') {
                    startDates = contracts.available[i].forward_starting_options;
                }

                if (formName == contracts.available[i]['contract_category']) {
                    if (contracts.available[i].barriers == 1) {
                        if (!barriers.hasOwnProperty(contracts.available[i]['contract_category'])) {
                            var barrier = {};
                            barrier['count'] = 1;
                            barrier['barrier'] = contracts.available[i]['barrier'];
                            barrier['barrier_category'] = contracts.available[i]['barrier_category'];
                            barriers[contracts.available[i]['contract_category']] = barrier;
                        }
                    } else if (contracts.available[i].barriers == 2) {
                        if (!barriers.hasOwnProperty(contracts.available[i]['contract_category'])) {
                            var barrier = {};
                            barrier['count'] = 1;
                            barrier['barrier'] = contracts.available[i]['high_barrier'];
                            barrier['barrier1'] = contracts.available[i]['low_barrier'];
                            barrier['barrier_category'] = contracts.available[i]['barrier_category'];
                            barriers[contracts.available[i]['contract_category']] = barrier;
                        }
                    }
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
        barriers: function () { return barriers; }
    };

})();
