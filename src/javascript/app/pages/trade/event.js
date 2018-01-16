const moment                = require('moment');
const TradingAnalysis       = require('./analysis');
const Barriers              = require('./barriers');
const commonTrading         = require('./common');
const Defaults              = require('./defaults');
const Durations             = require('./duration');
const GetTicks              = require('./get_ticks');
const Notifications         = require('./notifications');
const Price                 = require('./price');
const Process               = require('./process');
const Purchase              = require('./purchase');
const getMinMaxTime         = require('./common_independent').getMinMaxTime;
const getStartDateNode      = require('./common_independent').getStartDateNode;
const Tick                  = require('./tick');
const BinaryPjax            = require('../../base/binary_pjax');
const GTM                   = require('../../base/gtm');
const BinarySocket          = require('../../base/socket');
const getDecimalPlaces      = require('../../common/currency').getDecimalPlaces;
const isCryptocurrency      = require('../../common/currency').isCryptocurrency;
const onlyNumericOnKeypress = require('../../common/event_handler');
const TimePicker            = require('../../components/time_picker');
const dateValueChanged      = require('../../../_common/common_functions').dateValueChanged;
const isVisible             = require('../../../_common/common_functions').isVisible;
const getElementById        = require('../../../_common/common_functions').getElementById;

/*
 * TradingEvents object contains all the event handler function for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const TradingEvents = (() => {
    const initiate = () => {
        const attachTimePicker = (selector, checkEndTime) => {
            let minTime = window.time || moment.utc();
            let maxTime;
            if ($date_start && $date_start.val()) {
                const date_start_val = $date_start.val();
                const minMaxTime     = getMinMaxTime($date_start, minTime);

                minTime = minMaxTime.minTime;
                maxTime = minMaxTime.maxTime;

                // if date_start is not 'now'
                if (checkEndTime && !Durations.isNow(date_start_val)) {
                    const $expiry_date   = $('#expiry_date');
                    const endTime        = moment($expiry_date.attr('data-value'));
                    const start_time_val = $time_start.val().split(':');
                    const compare        = isNaN(+date_start_val) ? window.time : moment(+date_start_val * 1000);
                    // if expiry time is one day after start time, minTime can be 0
                    // but maxTime should be 24 hours after start time, so exact value of start time
                    if (endTime.isAfter(compare.format('YYYY-MM-DD HH:mm'), 'day')) {
                        minTime = 0;
                        maxTime = endTime.utc().hour(start_time_val[0]).minute(start_time_val[1]);
                    } else {
                        // if expiry time is same as today, min time should be the selected start time plus five minutes
                        minTime = minTime.hour(start_time_val[0]).minute(start_time_val[1]);
                        if (!(+start_time_val[0] === 23 && +start_time_val[1] === 55)) {
                            minTime = minTime.add(5, 'minutes');
                        }
                    }
                }
            }
            const initObj = {
                selector,
                minTime,
                maxTime: maxTime || null,
            };
            TimePicker.init(initObj);
        };

        /*
         * attach event to market list, so when client change market we need to update undelryings
         * and request for new Contract details to populate the form and request price accordingly
         */
        const onMarketChange = (market) => {
            commonTrading.showPriceOverlay();
            Defaults.set('market', market);

            // as different markets have different forms so remove from sessionStorage
            // it will default to proper one
            Defaults.remove('formname');
            Defaults.remove('underlying');
            Process.processMarket();
        };

        getElementById('contract_markets').addEventListener('change', (e) => {
            onMarketChange(e.target.value);
        });

        /*
         * attach event to form list, so when client click on different form we need to update form
         * and request for new Contract details to populate the form and request price accordingly
         */
        const contractFormEventChange = () => {
            Process.processContractForm();
            TradingAnalysis.request();
        };

        const form_nav_element = getElementById('contract_form_name_nav');
        form_nav_element.addEventListener('click', (e) => {
            const clicked_form = e.target;
            if (clicked_form && clicked_form.getAttribute('menuitem')) {
                const is_form_active = clicked_form.classList.contains('active') || clicked_form.parentElement.classList.contains('active');
                Defaults.set('formname', clicked_form.getAttribute('menuitem'));

                // if form is already active then no need to send same request again
                commonTrading.toggleActiveCatMenuElement(form_nav_element, e.target.getAttribute('menuitem'));

                if (!is_form_active) {
                    contractFormEventChange();
                }
            }
        });

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        getElementById('underlying').addEventListener('change', (e) => {
            if (e.target) {
                commonTrading.showFormOverlay();
                commonTrading.showPriceOverlay();
                if (e.target.selectedIndex < 0) {
                    e.target.selectedIndex = 0;
                }
                const underlying = e.target.value;
                Defaults.remove('barrier', 'barrier_high', 'barrier_low');
                Defaults.set('underlying', underlying);

                Tick.clean();

                commonTrading.updateWarmChart();

                getContracts(underlying);

                // get ticks for current underlying
                GetTicks.request(underlying);
                commonTrading.displayTooltip(Defaults.get('market'), underlying);
            }
        });

        const getContracts = (underlying) => {
            BinarySocket.send({ contracts_for: underlying }).then((response) => {
                Notifications.hide('CONNECTION_ERROR');
                Process.processContract(response);
            });
        };

        /*
         * bind event to change in duration amount, request new price
         */
        const triggerOnDurationChange = (e) => {
            if (e.target.value % 1 !== 0) {
                e.target.value = Math.floor(e.target.value);
            }
            Defaults.set('duration_amount', e.target.value);
            Durations.selectAmount(e.target.value);
            Price.processPriceRequest();
            commonTrading.submitForm(getElementById('websocket_form'));
        };
        const duration_amount_element = getElementById('duration_amount');
        let input_event_triggered     = false;          // For triggering one of the two events.
        if (duration_amount_element) {
            duration_amount_element.addEventListener('keypress', onlyNumericOnKeypress);
            // jquery needed for datepicker
            $('#duration_amount')
                .on('input', commonTrading.debounce((e) => {
                    triggerOnDurationChange(e);
                    Durations.validateMinDurationAmount();
                    input_event_triggered = true;
                }))
                .on('change', commonTrading.debounce((e) => {
                    // using Defaults, to update the value by datepicker if it was emptied by keyboard (delete)
                    Durations.validateMinDurationAmount();
                    if (input_event_triggered === false || !Defaults.get('duration_amount')) {
                        triggerOnDurationChange(e);
                    } else {
                        input_event_triggered = false;
                    }
                }));
        }

        /*
         * attach event to expiry time change, event need to populate duration
         * and request new price
         */
        getElementById('expiry_type').addEventListener('change', (e) => {
            Defaults.set('expiry_type', e.target.value);
            if (Process.onExpiryTypeChange(e.target.value)) Price.processPriceRequest();
        });

        /*
         * bind event to change in duration units, populate duration and request price
         */
        getElementById('duration_units').addEventListener('change', (e) => {
            Defaults.remove('barrier', 'barrier_high', 'barrier_low');
            Process.onDurationUnitChange(e.target.value);
            Price.processPriceRequest();
        });

        /*
         * bind event to change in endtime date and time
         */
        // need to use jquery as datepicker is used, if we switch to some other
        // datepicker we can move back to javascript
        Durations.expiryDateOnChange($('#expiry_date'));

        const end_time_element = getElementById('expiry_time');
        /*
         * attach datepicker and timepicker to end time durations
         * have to use jquery
         */
        attachTimePicker('#expiry_time');
        $('#expiry_time')
            .on('focus click', () => { attachTimePicker('#expiry_time', 1); })
            .on('change input blur', function () {
                if (!dateValueChanged(this, 'time')) {
                    return false;
                }
                Durations.setTime(end_time_element.value, 1);
                return true;
            });

        /*
         * attach event to change in amount, request new price only
         */
        const amount_element = getElementById('amount');
        amount_element.addEventListener('keypress', onlyNumericOnKeypress);
        amount_element.addEventListener('input', commonTrading.debounce((e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            const currency = Defaults.get('currency');
            if (isStandardFloat(e.target.value)) {
                e.target.value = parseFloat(e.target.value).toFixed(getDecimalPlaces(currency));
            }
            Defaults.set(`amount${isCryptocurrency(currency) ? '_crypto' : ''}`, e.target.value);
            Price.processPriceRequest();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));

        let timepicker_initialized = false;
        const initTimePicker       = () => {
            if (timepicker_initialized) return;
            timepicker_initialized = true;
            attachTimePicker('#time_start');
            $time_start
                .on('focus click', () => { attachTimePicker('#time_start'); })
                .on('change input blur', function () {
                    if (!dateValueChanged(this, 'time')) {
                        return false;
                    }
                    Defaults.set('time_start', time_start_element.value);
                    let make_price_request = 1;
                    if (Defaults.get('expiry_date')) {
                        // if time changed, proposal will be sent there if not we should send it here
                        make_price_request = Durations.selectEndDate(moment(Defaults.get('expiry_date'))) ? -1 : 1;
                    }
                    if (make_price_request > 0) {
                        Price.processPriceRequest();
                    }
                    return true;
                });
        };

        /*
         * attach event to start time, display duration based on
         * whether start time is forward starting or not and request
         * new price
         */
        const date_start_element = getStartDateNode();
        if (date_start_element) {
            date_start_element.addEventListener('change', (e) => {
                Defaults.set('date_start', e.target.value);
                initTimePicker();
                const r = Durations.onStartDateChange(e.target.value);
                if (r >= 0) {
                    Price.processPriceRequest();
                }
            });
        }

        const time_start_element = getElementById('time_start');
        const $date_start        = $('#date_start');
        const $time_start        = $('#time_start');
        if (date_start_element.value !== 'now') {
            initTimePicker();
        }

        /*
         * attach event to change in amount type that is whether its
         * payout or stake and request new price
         */
        getElementById('amount_type').addEventListener('change', (e) => {
            Defaults.set('amount_type', e.target.value);
            Price.processPriceRequest();
        });

        /*
         * attach event to change in submarkets. We need to disable
         * underlyings that are not in selected seubmarkets
         */
        getElementById('submarket').addEventListener('change', (e) => {
            if (e.target) {
                const elem        = getElementById('underlying');
                const underlyings = elem.children;

                for (let i = 0, len = underlyings.length; i < len; i++) {
                    underlyings[i].disabled = e.target.value !== 'all' && e.target.value !== underlyings[i].className;
                }

                // as submarket change has modified the underlying list so we need to manually
                // fire change event for underlying
                document.querySelectorAll('#underlying option:enabled')[0].selected = 'selected';
                const event = new Event('change');
                elem.dispatchEvent(event);
            }
        });

        /*
         * attach an event to change in currency
         */
        getElementById('currency').addEventListener('change', (e) => {
            const currency = e.target.value;
            Defaults.set('currency', currency);
            const amount = isCryptocurrency(currency) ? 'amount_crypto' : 'amount';
            if (Defaults.get(amount)) $('#amount').val(Defaults.get(amount));
            Price.processPriceRequest();
        });

        /*
         * attach event to purchase buttons to buy the current contract
         */
        $('.purchase_button').on('click dblclick', function () {
            if (isVisible(getElementById('confirmation_message_container')) || /disabled/.test(this.parentNode.classList)) {
                return;
            }
            const id        = this.getAttribute('data-purchase-id');
            const ask_price = this.getAttribute('data-ask-price');

            const params = { buy: id, price: ask_price, passthrough: {} };
            Object.keys(this.attributes).forEach(function (attr) {
                if (attr && this.attributes[attr] && this.attributes[attr].name &&
                    !/data-balloon/.test(this.attributes[attr].name)) { // do not send tooltip data
                    const m = this.attributes[attr].name.match(/data-(.+)/);

                    if (m && m[1] && m[1] !== 'purchase-id' && m[1] !== 'passthrough') {
                        params.passthrough[m[1]] = this.attributes[attr].value;
                    }
                }
            }, this);
            if (id && ask_price) {
                $('.purchase_button').css('visibility', 'hidden');
                BinarySocket.send(params).then((response) => {
                    Purchase.display(response);
                    GTM.pushPurchaseData(response);
                });
                Price.incrFormId();
                Price.processForgetProposals();
            }
        });

        /*
         * attach event to close icon for purchase container
         */
        $('#close_confirmation_container').on('click dblclick', (e) => {
            if (e.target && isVisible(getElementById('confirmation_message_container'))) {
                e.preventDefault();
                commonTrading.hideOverlayContainer();
                Price.processPriceRequest();
            }
        });

        /*
         * attach an event to change in barrier
         */
        $('#barrier')
            .on('keypress', (ev) => { onlyNumericOnKeypress(ev, [43, 45, 46]); })
            .on('input', commonTrading.debounce((e) => {
                Barriers.validateBarrier();
                Defaults.set('barrier', e.target.value);
                Price.processPriceRequest();
                commonTrading.submitForm(getElementById('websocket_form'));
            }, 1000));

        /*
         * attach an event to change in low barrier
         */
        const low_barrier_element = getElementById('barrier_low');
        low_barrier_element.addEventListener('input', commonTrading.debounce((e) => {
            Defaults.set('barrier_low', e.target.value);
            Price.processPriceRequest();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));
        low_barrier_element.addEventListener('keypress', (ev) => {
            onlyNumericOnKeypress(ev, [43, 45, 46]);
        });

        /*
         * attach an event to change in high barrier
         */
        const high_barrier_element = getElementById('barrier_high');
        high_barrier_element.addEventListener('input', commonTrading.debounce((e) => {
            Defaults.set('barrier_high', e.target.value);
            Price.processPriceRequest();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));
        high_barrier_element.addEventListener('keypress', (ev) => {
            onlyNumericOnKeypress(ev, [43, 45, 46]);
        });

        /*
         * attach an event to change in digit prediction input
         */
        getElementById('prediction').addEventListener('change', commonTrading.debounce((e) => {
            Defaults.set('prediction', e.target.value);
            Price.processPriceRequest();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));

        // Verify number of decimal places doesn't exceed the allowed decimal places according to the currency
        const isStandardFloat = value => (
            !isNaN(value) &&
            value % 1 !== 0 &&
            ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length > getDecimalPlaces(Defaults.get('currency'))
        );

        getElementById('trading_init_progress').addEventListener('click', commonTrading.debounce(() => {
            commonTrading.reloadPage();
        }));

        getElementById('symbol_tip').addEventListener('click', commonTrading.debounce((e) => {
            BinaryPjax.load(e.target.getAttribute('target'));
        }));
    };

    return {
        init: initiate,
    };
})();

module.exports = TradingEvents;
