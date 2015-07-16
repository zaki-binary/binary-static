var Trade = (function () {
    'use strict';

    var tradeMarkets, tradeSubmarkets, tradeUnderlyings, tradeContractForms;

    var processOfferings = function (data, market, formName, submarket, underlying) {
        var selectors = data.selectors;
        var offerings = data.offerings;

        var submarketElements = {}, underlyingElements = {}, contractCategories = {};

        submarketElements['all'] = 'All';

        market_label:
        for (var i = 0, offlen = offerings.length; i < offlen; i++) {
            market = market || 'Forex';
            var mkt = offerings[i].market;
            if (mkt == market) {
                submarket_label:
                for(var j = 0, sbmktlen = offerings[i].available.length; j < sbmktlen; j++) {
                    var loop_submarket = offerings[i].available[j].submarket;
                    if (submarket && submarket != loop_submarket) {
                        continue submarket_label;
                    }
                    underlying_label:
                    for (var k = 0, undrlylen = offerings[i].available[j].available.length; k < undrlylen; k++) {
                        var loop_underlying = offerings[i].available[j].available[k];
                        if(underlying && underlying != loop_underlying.symbol) {
                            continue underlying_label;
                        }
                        for (var l = 0, ctcategorylen = offerings[i].available[j].available[k].available.length; l < ctcategorylen; l++) {
                            var contractCategory = offerings[i].available[j].available[k].available[l].contract_category;
                            var barrierCategory, isBarrierUndefinedRequired = false;

                            if (!formName) {
                                formName = 'callput';
                                barrierCategory = 'euro_atm';
                            } else if (formName == 'risefall') {
                                formName = 'callput';
                                barrierCategory = 'euro_atm';
                            } else if (formName == 'higherlower') {
                                formName = 'callput';
                                barrierCategory = 'euro_non_atm';
                            }

                            for (var m = 0, ctcategoryavalen = offerings[i].available[j].available[k].available[l].available.length; m < ctcategoryavalen; m++) {
                                for (var property in  offerings[i].available[j].available[k].available[l].available[m]) {
                                    if (offerings[i].available[j].available[k].available[l].available[m].hasOwnProperty(property)) {
                                        var prop_value = offerings[i].available[j].available[k].available[l].available[m][property];
                                        if (property == 'barrier_category') {
                                            if (!barrierCategory) {
                                                barrierCategory = prop_value;
                                                isBarrierUndefinedRequired = true;
                                            }
                                            if (contractCategory && !contractCategories.hasOwnProperty(contractCategory)) {
                                                if (contractCategory == 'callput') {
                                                    if( prop_value == 'euro_atm') {
                                                        contractCategories['risefall'] = 'risefall';
                                                    } else {
                                                        contractCategories['higherlower'] = 'higherlower';
                                                    }
                                                } else {
                                                    contractCategories[contractCategory] = contractCategory;
                                                }
                                            }
                                            if(formName == contractCategory && barrierCategory == prop_value) {
                                                submarketElements[loop_submarket.toLowerCase().replace(/ /g, '_')] = loop_submarket;
                                                underlyingElements[loop_underlying.symbol] = loop_underlying.symbol_display;
                                            }
                                            if (isBarrierUndefinedRequired) {
                                                barrierCategory = undefined;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if(underlying && underlying == loop_underlying.symbol) {
                            break underlying_label;
                        }
                    }
                    if (submarket && submarket == loop_submarket) {
                        break submarket_label;
                    }
                }
                break market_label;
            } else {
                continue;
            }
        }
        tradeMarkets = Object.keys(selectors.market);
        tradeContractForms = contractCategories;
        tradeSubmarkets = submarketElements;
        tradeUnderlyings = underlyingElements;
    };

    var details = function (offerings, market, formName, submarket, underlying) {
        processOfferings(offerings, market, formName, submarket, underlying);
    };

    return {
        details: details,
        markets: function () { return tradeMarkets; },
        submarkets: function () { return tradeSubmarkets; },
        underlyings: function () { return tradeUnderlyings; },
        contractForms: function () { return tradeContractForms; }
    };

})();
