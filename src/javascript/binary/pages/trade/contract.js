var Contract = (function () {
    'use strict';

    var open, close, contractDetails = [];

    var processContracts = function (contractObject, formName, expiryType) {
        var contracts = contractObject.contracts_for;
        open = contracts['open'], close = contracts['close'];
        var contractsArray = [], sendAll = true, barrierCategory;

        if (formName) {
            if(formName == 'risefall') {
                formName = 'callput';
                barrierCategory = 'euro_atm';
            } else if (formName == 'higherlower') {
                formName = 'callput';
                barrierCategory = '"euro_non_atm"';
            }
            for(var i = 0, len = contracts.available.length; i < len; i++) {
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
        contracts: function () { return contractDetails; }
    };

})();

