const moment                = require('moment');
const TradingAnalysis_Beta  = require('./analysis');
const Barriers_Beta         = require('./barriers');
const Durations_Beta        = require('./duration');
const Price_Beta            = require('./price');
const Process_Beta          = require('./process');
const Purchase_Beta         = require('./purchase');
const setChart              = require('../charts/webtrader_chart').setChart;
const Defaults              = require('../defaults');
const GetTicks              = require('../get_ticks');
const Tick                  = require('../tick');
const commonTrading         = require('../common');
const getStartDateNode      = require('../common_independent').getStartDateNode;
const Notifications         = require('../notifications');
const BinaryPjax            = require('../../../base/binary_pjax');
const GTM                   = require('../../../base/gtm');
const BinarySocket          = require('../../../base/socket');
const formatMoney           = require('../../../common/currency').formatMoney;
const onlyNumericOnKeypress = require('../../../common/event_handler');
const TimePicker            = require('../../../components/time_picker');
const dateValueChanged      = require('../../../../_common/common_functions').dateValueChanged;
const getElementById        = require('../../../../_common/common_functions').getElementById;
const isVisible             = require('../../../../_common/common_functions').isVisible;

/*
 * TradingEvents object contains all the event handler function for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const TradingEvents_Beta = (() => {
    const initiate = () => {
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
            Process_Beta.processMarket_Beta();
        };

        getElementById('contract_markets').addEventListener('change', (e) => {
            onMarketChange(e.target.value);
        });

        /*
         * attach event to form list, so when client click on different form we need to update form
         * and request for new Contract details to populate the form and request price accordingly
         */
        const contractFormEventChange = () => {
            Process_Beta.processContractForm_Beta();
            TradingAnalysis_Beta.request();
        };

        const form_nav_element = getElementById('contract_form_name_nav');
        if (form_nav_element) {
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
        }

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        getElementById('underlying').addEventListener('change', (e) => {
            if (e.target) {
                setChart();
                commonTrading.showFormOverlay();
                commonTrading.showPriceOverlay();
                if (e.target.selectedIndex < 0) {
                    e.target.selectedIndex = 0;
                }
                const underlying = e.target.value;
                Defaults.remove('barrier', 'barrier_high', 'barrier_low');
                Defaults.set('underlying', underlying);
                TradingAnalysis_Beta.request();

                Tick.clean();

                commonTrading.updateWarmChart();

                BinarySocket.send({ contracts_for: underlying }).then((response) => {
                    Notifications.hide('CONNECTION_ERROR');
                    Process_Beta.processContract_Beta(response);
                });

                // forget the old tick id i.e. close the old tick stream
                Process_Beta.processForgetTicks_Beta();
                // get ticks for current underlying
                GetTicks.request(underlying);
                commonTrading.displayTooltip_Beta(Defaults.get('market'), underlying);
            }
        });

        /*
         * bind event to change in duration amount, request new price
         */
        const triggerOnDurationChange = (e) => {
            if (e.target.value % 1 !== 0) {
                e.target.value = Math.floor(e.target.value);
            }
            Defaults.set('duration_amount', e.target.value);
            Durations_Beta.selectAmount(e.target.value);
            Price_Beta.processPriceRequest_Beta();
            commonTrading.submitForm(getElementById('websocket_form'));
        };

        let input_event_triggered = false;          // For triggering one of the two events.
        getElementById('duration_amount').addEventListener('keypress', onlyNumericOnKeypress);
        // jquery needed for datepicker
        $('#duration_amount')
            .on('input', commonTrading.debounce((e) => {
                triggerOnDurationChange(e);
                Durations_Beta.validateMinDurationAmount();
                input_event_triggered = true;
            }))
            .on('change', commonTrading.debounce((e) => {
                // using Defaults, to update the value by datepicker if it was emptied by keyboard (delete)
                Durations_Beta.validateMinDurationAmount();
                if (input_event_triggered === false || !Defaults.get('duration_amount')) {
                    triggerOnDurationChange(e);
                } else {
                    input_event_triggered = false;
                }
            }));

        /*
         * attach event to expiry time change, event need to populate duration
         * and request new price
         */
        const expiry_type_element = getElementById('expiry_type');
        expiry_type_element.addEventListener('change', (e) => {
            Defaults.set('expiry_type', e.target.value);
            Process_Beta.onExpiryTypeChange(e.target.value);
            if (expiry_type_element.value !== 'endtime') Price_Beta.processPriceRequest_Beta();
        });

        /*
         * bind event to change in duration units, populate duration and request price
         */
        getElementById('duration_units').addEventListener('change', (e) => {
            Defaults.remove('barrier', 'barrier_high', 'barrier_low');
            Process_Beta.onDurationUnitChange(e.target.value);
            Price_Beta.processPriceRequest_Beta();
        });

        /*
         * bind event to change in endtime date and time
         */
        // need to use jquery as datepicker is used, if we switch to some other
        // datepicker we can move back to javascript
        $('#expiry_date').on('change input', function () {
            if (!dateValueChanged(this, 'date')) {
                return false;
            }
            // if start time is less than end time
            if (commonTrading.timeIsValid($('#expiry_date'))) {
                Durations_Beta.selectEndDate(moment(this.getAttribute('data-value')));
            }
            return true;
        });

        const end_time_element = getElementById('expiry_time');
        /*
         * attach datepicker and timepicker to end time durations
         * have to use jquery
         */
        attachTimePicker();
        $('#expiry_time')
            .on('focus, click', attachTimePicker)
            .on('keypress', (ev) => { onlyNumericOnKeypress(ev, [58]); })
            .on('change input blur', function () {
                if (!dateValueChanged(this, 'time')) {
                    return false;
                }
                // if start time is less than end time
                if (commonTrading.timeIsValid($('#expiry_time'))) {
                    Durations_Beta.setTime(end_time_element.value);
                    Price_Beta.processPriceRequest_Beta();
                }
                return true;
            });

        /*
         * attach event to change in amount, request new price only
         */
        const amount_element = getElementById('amount');
        amount_element.addEventListener('keypress', onlyNumericOnKeypress);
        amount_element.addEventListener('input', commonTrading.debounce((e) => {
            e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            if (isStandardFloat(e.target.value)) {
                e.target.value = formatMoney(Defaults.get('currency'), parseFloat(e.target.value), 1);
            }
            Defaults.set('amount', e.target.value);
            Price_Beta.processPriceRequest_Beta();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));

        /*
         * attach event to start time, display duration based on
         * whether start time is forward starting or not and request
         * new price
         */
        const date_start_element = getStartDateNode();
        if (date_start_element) {
            date_start_element.addEventListener('change', (e) => {
                Defaults.set('date_start', e.target.value);
                const r = Durations_Beta.onStartDateChange(e.target.value);
                if (r >= 0) {
                    Price_Beta.processPriceRequest_Beta();
                }
            });
        }

        /*
         * attach event to change in amount type that is whether its
         * payout or stake and request new price
         */
        getElementById('amount_type').addEventListener('change', (e) => {
            Defaults.set('amount_type', e.target.value);
            Price_Beta.processPriceRequest_Beta();
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
            Defaults.set('currency', e.target.value);
            Price_Beta.processPriceRequest_Beta();
        });

        /*
         * attach event to purchase buttons to buy the current contract
         */
        $('.purchase_button').on('click dblclick', function () {
            if (!isVisible(getElementById('confirmation_message_container'))) {
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
                    BinarySocket.send(params).then((response) => {
                        Purchase_Beta.display(response);
                        GTM.pushPurchaseData(response);
                    });
                    Price_Beta.incrFormId();
                    Price_Beta.processForgetProposals_Beta();
                }
            }
        });

        /*
         * attach event to close icon for purchase container
         */
        $('#close_confirmation_container, #contract_purchase_new_trade').on('click dblclick', (e) => {
            if (e.target) {
                e.preventDefault();
                getElementById('contract_confirmation_container').style.display = 'none';
                getElementById('contracts_list').style.display = 'flex';
                Price_Beta.processPriceRequest_Beta();
            }
        });

        /*
         * attach an event to change in barrier
         */
        $('#barrier')
            .on('keypress', (ev) => { onlyNumericOnKeypress(ev, [43, 45, 46]); })
            .on('input', commonTrading.debounce((e) => {
                Barriers_Beta.validateBarrier();
                Defaults.set('barrier', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                commonTrading.submitForm(getElementById('websocket_form'));
            }, 1000));

        /*
         * attach an event to change in low barrier
         */
        getElementById('barrier_low').addEventListener('input', commonTrading.debounce((e) => {
            Defaults.set('barrier_low', e.target.value);
            Price_Beta.processPriceRequest_Beta();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));

        /*
         * attach an event to change in high barrier
         */
        getElementById('barrier_high').addEventListener('input', commonTrading.debounce((e) => {
            Defaults.set('barrier_high', e.target.value);
            Price_Beta.processPriceRequest_Beta();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));

        /*
         * attach an event to change in digit prediction input
         */
        getElementById('prediction').addEventListener('change', commonTrading.debounce((e) => {
            Defaults.set('prediction', e.target.value);
            Price_Beta.processPriceRequest_Beta();
            commonTrading.submitForm(getElementById('websocket_form'));
        }));

        // For verifying there are 2 digits after decimal
        const isStandardFloat = (value => (
            !isNaN(value) && value % 1 !== 0 && ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length > 2
        ));

        getElementById('trading_init_progress').addEventListener('click', commonTrading.debounce(() => {
            commonTrading.reloadPage();
        }));

        getElementById('symbol_tip').addEventListener('click', commonTrading.debounce((e) => {
            BinaryPjax.load(e.target.getAttribute('target'));
        }));
    };

    const attachTimePicker = () => {
        const date_start     = getElementById('date_start').value;
        const now            = !date_start || date_start === 'now';
        const current_moment = now ? (window.time || moment.utc()) : parseInt(date_start) * 1000;
        TimePicker.init({
            selector: '#expiry_time',
            minTime : current_moment,
        });
    };

    return {
        init: initiate,
    };
})();

module.exports = TradingEvents_Beta;
