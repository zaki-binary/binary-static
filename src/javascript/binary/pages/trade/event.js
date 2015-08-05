/*
 * attach event to market list, so when client change market we need to update form
 * and request for new Contract details to populate the form and request price accordingly
 */
var market_nav_elm = document.getElementById('contract_market_nav');
if (market_nav_elm) {
    market_nav_elm.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'LI') {
            sessionStorage.setItem('market', e.target.id);
            marketChangeEvent(e.target.id);
        }
    });
}

var marketChangeEvent = function (market) {
    'use strict';
    processMarketOfferings(Offerings.offerings(), market);
};

/*
 * attach event to form list, so when client click on different form we need to update form
 * and request for new Contract details to populate the form and request price accordingly
 */
var form_nav_elm = document.getElementById('contract_form_name_nav');
if (form_nav_elm) {
    form_nav_elm.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'LI') {
            sessionStorage.setItem('formname', e.target.id);
            contractFormEventChange(e.target.id);
        }
    });
}

var contractFormEventChange = function (formName) {
    'use strict';

    var market = sessionStorage.getItem('market') || 'Forex';

    market = market.charAt(0).toUpperCase() + market.substring(1);

    // pass the original offerings as we don't want to request offerings again and again
    Offerings.details(Offerings.offerings(), market, formName);

    // change only submarkets and underlyings as per formName change
    displayOptions('submarket',Offerings.submarkets());
    displayUnderlyings();

    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // get the contract details based on underlying as formName has changed
    TradeSocket.send({ contracts_for: underlying });
};

/*
 * attach event to underlying change, event need to request new contract details and price
 */
var underlying_elm = document.getElementById('underlying');
if (underlying_elm) {
    underlying_elm.addEventListener('change', function(e) {
        if (e.target) {
            sessionStorage.setItem('underlying', e.target.value);
            underlyingEventChange(e.target.value);
        }
    });
}

var underlyingEventChange = function (underlying) {
    'use strict';
    TradeSocket.send({ contracts_for: underlying });
};

/*
 * bind event to change in duration amount, request new price
 */
var duration_amount_elm = document.getElementById('duration_amount');
if (duration_amount_elm) {
    duration_amount_elm.addEventListener('input', function (e) {
        processPriceRequest();
    });
}

/*
 * bind event to change in duration units, populate duration and request price
 */
var duration_unit_elm = document.getElementById('duration_units');
if (duration_unit_elm) {
    duration_unit_elm.addEventListener('change', function () {
        durationPopulate();
        processPriceRequest();
    });
}

/*
 * attach event to expiry time change, event need to populate duration
 * and request new price
 */
var expiry_type_elm = document.getElementById('expiry_type');
if (expiry_type_elm) {
    expiry_type_elm.addEventListener('change', function(e) {
        durationPopulate();
        if(e.target && e.target.value === 'endtime') {
            var current_moment = moment().add(5, 'minutes').utc();
            document.getElementById('expiry_date').value = current_moment.format('YYYY-MM-DD');
            document.getElementById('expiry_time').value = current_moment.format('HH:mm');
        }
        processPriceRequest();
    });
}

/*
 * attach event to change in amount, request new price only
 */
var amount_elm = document.getElementById('amount');
if (amount_elm) {
    amount_elm.addEventListener('input', function(e) {
        processPriceRequest();
    });
}

/*
 * attach event to start time, display duration based on
 * whether start time is forward starting or not and request
 * new price
 */
var date_start_elm = document.getElementById('date_start');
if (date_start_elm) {
    date_start_elm.addEventListener('change', function (e) {
        if (e.target && e.target.value === 'now') {
            displayDurations('spot');
        } else {
            displayDurations('forward');
        }
        processPriceRequest();
    });
}

/*
 * attach event to change in amount type that is whether its
 * payout or stake and request new price
 */
var amount_type_elm = document.getElementById('amount_type');
if (amount_type_elm) {
    amount_type_elm.addEventListener('change', function (e) {
        processPriceRequest();
    });
}

/*
 * attach event to change in submarkets. We need to disable
 * underlyings that are not in selected seubmarkets
 */
var submarket_elm = document.getElementById('submarket');
if (submarket_elm) {
    submarket_elm.addEventListener('change', function (e) {
        if (e.target) {
            var elem = document.getElementById('underlying');
            var underlyings = elem.children;

            for (var i = 0, len = underlyings.length; i < len; i++ ) {
                if (e.target.value !== 'all' && e.target.value !== underlyings[i].className) {
                    underlyings[i].disabled = true;
                } else {
                    underlyings[i].disabled = false;
                }
            }

            // as submarket change has modified the underlying list so we need to manually
            // fire change event for underlying
            document.querySelectorAll('#underlying option:enabled')[0].selected = 'selected';
            var event = new Event('change');
            elem.dispatchEvent(event);
        }
    });
}
