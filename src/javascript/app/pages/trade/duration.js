const moment             = require('moment');
const Barriers           = require('./barriers');
const commonTrading      = require('./common');
const commonIndependent  = require('./common_independent');
const Contract           = require('./contract');
const Defaults           = require('./defaults');
const Price              = require('./price');
const BinarySocket       = require('../../base/socket');
const DatePicker         = require('../../components/date_picker');
const CommonFunctions    = require('../../../_common/common_functions');
const localize           = require('../../../_common/localize').localize;
const State              = require('../../../_common/storage').State;
const toISOFormat        = require('../../../_common/string_util').toISOFormat;
const toReadableFormat   = require('../../../_common/string_util').toReadableFormat;
const createElement      = require('../../../_common/utility').createElement;
const getPropertyValue   = require('../../../_common/utility').getPropertyValue;

/*
 * Handles duration processing display
 *
 * It process `Contract.durations()` and display them according to
 * the current `Contract.form()` and `Contract.barriers()`
 *
 * It also populate expiry type select box i.e Durations and Endtime select
 *
 */

const Durations = (() => {
    let selected_duration = {};
    let has_end_date      = 0;

    const displayDurations = (time_start_val) => {
        let date_time_start = moment(Defaults.get('date_start') * 1000);
        if (time_start_val) {
            const start_time = time_start_val.split(':');
            date_time_start  = date_time_start.utc().hour(start_time[0]).minute(start_time[1]);
        }

        let start_type;
        if (Defaults.get('date_start') !== 'now' && State.get('is_start_dates_displayed') && date_time_start.isAfter(moment())) {
            start_type = 'forward';
        } else {
            start_type = 'spot';
        }

        const durations = Contract.durations();
        if (durations === false) {
            CommonFunctions.getElementById('expiry_row').style.display = 'none';
            Defaults.remove('expiry_type', 'duration_amount', 'duration_units', 'expiry_date', 'expiry_time');
            return false;
        }

        const target             = CommonFunctions.getElementById('duration_units');
        const form_name          = Contract.form();
        const barrier_category   = Contract.barrier();
        const duration_container = {};

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        Object.keys(durations).forEach((key) => {
            Object.keys(durations[key][form_name]).forEach((form) => {
                let obj = {};
                if (barrier_category) {
                    obj = durations[key][form_name][barrier_category];
                } else {
                    obj = durations[key][form_name][form];
                }
                Object.keys(obj).forEach((type) => {
                    if (start_type) {
                        if (start_type === type) {
                            if (!getPropertyValue(duration_container, start_type)) {
                                duration_container[key] = obj[start_type];
                            }
                        }
                    } else if (!getPropertyValue(duration_container, type)) {
                        duration_container[key] = obj[type];
                    }
                });
            });
        });

        const duration_list = {};
        Object.keys(duration_container).forEach((duration) => {
            const text_mapping_min = durationTextValueMappings(duration_container[duration].min_contract_duration);
            const text_mapping_max = durationTextValueMappings(duration_container[duration].max_contract_duration);
            const min_unit         = text_mapping_min.unit;

            if (duration === 'intraday') {
                switch (min_unit) {
                    case 's':
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
                        duration_list.m         = makeDurationOption(durationTextValueMappings('1m'), text_mapping_max, true);
                        duration_list.h         = makeDurationOption(durationTextValueMappings('1h'), text_mapping_max);
                        break;
                    case 'm':
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max, true);
                        duration_list.h         = makeDurationOption(durationTextValueMappings('1h'), text_mapping_max);
                        break;
                    case 'h':
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
                        break;
                    default :
                        duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
                        break;
                }
            } else if (duration === 'daily' || duration === 'tick') {
                duration_list[min_unit] = makeDurationOption(text_mapping_min, text_mapping_max);
            }
        });

        const list = Object.keys(duration_list).sort((a, b) => (
            commonTrading.durationOrder(a) > commonTrading.durationOrder(b) ? 1 : -1
        ));

        has_end_date = 0;
        for (let k = 0; k < list.length; k++) {
            const d = list[k];
            if (d !== 't') {
                has_end_date = 1;
            }
            if (getPropertyValue(duration_list, d)) {
                target.appendChild(duration_list[d]);
            }
        }

        if (selected_duration.unit) {
            if (!commonTrading.selectOption(selected_duration.unit, target)) {
                selected_duration = {};
            }
        }

        return durationPopulate();
    };

    const makeDurationOption = (map_min, map_max, is_selected) => {
        const option  = createElement('option', { value: map_min.unit, 'data-minimum': map_min.value, text: map_min.text });
        if (map_max.value && map_max.unit) {
            const max = convertDurationUnit(map_max.value, map_max.unit, map_min.unit);
            if (max) {
                option.setAttribute('data-maximum', max);
            }
        }
        if (is_selected) {
            option.setAttribute('selected', 'selected');
        }
        return option;
    };

    const convertDurationUnit = (value, from_unit, to_unit) => {
        if (!value || !from_unit || !to_unit) return null;
        if (from_unit === to_unit) return value;
        const seconds = {
            s: 1,
            m: 60,
            h: 3600,
            d: 3600 * 24,
        };
        return (value * seconds[from_unit]) / seconds[to_unit];
    };

    const displayEndTime = () => {
        const date_start     = CommonFunctions.getElementById('date_start').value;
        const now            = !date_start || date_start === 'now';
        const current_moment = moment((now ? window.time : parseInt(date_start) * 1000)).add(5, 'minutes').utc();
        let expiry_date      = Defaults.get('expiry_date') ? moment(Defaults.get('expiry_date')) : current_moment;
        let expiry_time      = Defaults.get('expiry_time') || current_moment.format('HH:mm');
        let expiry_date_iso  = toISOFormat(expiry_date);

        if (moment.utc(`${expiry_date_iso} ${expiry_time}`).valueOf() < current_moment.valueOf()) {
            expiry_date     = current_moment;
            expiry_date_iso = toISOFormat(expiry_date);
            expiry_time     = current_moment.format('HH:mm');
        }

        const expiry_date_el = CommonFunctions.getElementById('expiry_date');
        const expiry_time_el = CommonFunctions.getElementById('expiry_time');

        expiry_date_el.value = toReadableFormat(expiry_date);
        expiry_date_el.setAttribute('data-value', expiry_date_iso);
        expiry_time_el.value = expiry_time;
        expiry_time_el.setAttribute('data-value', expiry_time);
        Defaults.set('expiry_date', expiry_date_iso);
        Defaults.set('expiry_time', expiry_time);
        setTime(expiry_time);

        durationPopulate();
    };

    const durationTextValueMappings = (str) => {
        const mapping = {
            s: localize('seconds'),
            m: localize('minutes'),
            h: localize('hours'),
            d: localize('days'),
            t: localize('ticks'),
        };

        const arry = str ? str.toString().match(/[a-zA-Z]+|[0-9]+/g) : [];
        const obj  = {};

        if (arry.length > 1) {
            obj.unit  = arry[1];
            obj.text  = mapping[arry[1]];
            obj.value = arry[0];
        } else {
            obj.unit  = 't';
            obj.text  = mapping.t;
            obj.value = arry[0];
        }

        return obj;
    };

    const duration_map = {
        t: 'tick',
        s: 'second',
        m: 'minute',
        h: 'hour',
        d: 'day',
    };

    const durationPopulate = () => {
        const unit = CommonFunctions.getElementById('duration_units');
        if (!unit.options[unit.selectedIndex]) return false;
        const unit_min_value = unit.options[unit.selectedIndex].getAttribute('data-minimum');
        const unit_max_value = unit.options[unit.selectedIndex].getAttribute('data-maximum');
        let unit_value       = Defaults.get('duration_amount') || unit_min_value;
        unit.value           = Defaults.get('duration_units') &&
            document.querySelectorAll(`select[id="duration_units"] [value="${Defaults.get('duration_units')}"]`).length ?
            Defaults.get('duration_units') : unit.value;
        CommonFunctions.elementTextContent(CommonFunctions.getElementById('duration_minimum'), unit_min_value);
        CommonFunctions.elementTextContent(CommonFunctions.getElementById('duration_unit'), localize(duration_map[unit.value] + (+unit_min_value > 1 ? 's' : '')));
        CommonFunctions.elementTextContent(CommonFunctions.getElementById('duration_maximum'), unit_max_value);
        if (selected_duration.amount && selected_duration.unit > unit_value) {
            unit_value = selected_duration.amount;
        }
        CommonFunctions.getElementById('duration_amount').value = unit_value;
        Defaults.set('duration_amount', unit_value);
        displayExpiryType();
        Defaults.set('duration_units', unit.value);

        // jquery for datepicker
        const amount_element = $('#duration_amount');
        const duration_id    = '#duration_amount';
        if (unit.value === 'd') {
            const tomorrow = window.time ? new Date(window.time.valueOf()) : new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            DatePicker.init({
                selector: duration_id,
                type    : 'diff',
                minDate : 1,
                maxDate : 365,
                native  : false,
            });
            amount_element.change((value) => {
                let day_diff;
                const $duration_amount_val = $('#duration_amount').val();
                if ($duration_amount_val) {
                    day_diff = $duration_amount_val;
                } else {
                    const data_value = value.target.getAttribute('data-value');
                    const date       = data_value ? new Date(data_value) : new Date();
                    const today      = window.time ? window.time.valueOf() : new Date();

                    day_diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
                }
                amount_element.val(day_diff);
            });
        } else {
            DatePicker.hide(duration_id);
        }

        const requested = changeExpiryTimeType();

        validateMinDurationAmount();
        // we need to call it here as for days we need to show absolute barriers
        Barriers.display();

        return requested;
    };

    const expiryDateOnChange = ($expiry_date) => {
        $expiry_date.off('change').on('change', function () {
            if (!CommonFunctions.dateValueChanged(this, 'date')) {
                return false;
            }
            let selected_value;
            if ($(this).is('select')) {
                selected_value = $(this).find('option:selected').attr('data-value');
                $expiry_date.attr('data-value', selected_value);
            } else {
                selected_value = this.getAttribute('data-value');
            }
            const requested = selectEndDate(moment(selected_value));
            if (requested < 1) {
                commonTrading.timeIsValid($('#expiry_time'));
                Price.processPriceRequest();
            }
            return true;
        });
    };

    const changeExpiryTimeType = () => {
        let requested = -1;
        if (CommonFunctions.getElementById('expiry_type').value === 'endtime') {
            let $expiry_date     = $('#expiry_date');
            const date_start_val = CommonFunctions.getElementById('date_start').value || 'now';
            const is_now         = isNow(date_start_val);
            const is_risefall    = /risefall/.test(Defaults.get('formname')) || false;

            if (is_now || !is_risefall) {
                if (!$expiry_date.is('input')) {
                    $expiry_date.replaceWith($('<input/>', { id: 'expiry_date', type: 'text', readonly: 'readonly', autocomplete: 'off', 'data-value': $expiry_date.attr('data-value') }))
                        .val(toReadableFormat($expiry_date.attr('data-value')));
                    $expiry_date = $('#expiry_date');
                    expiryDateOnChange($expiry_date);
                }
                DatePicker.init({
                    selector: '#expiry_date',
                    minDate : 0,
                    maxDate : 365,
                });
            } else {
                const min_date    = moment.utc(+date_start_val * 1000);
                const next_day    = moment.utc(+date_start_val * 1000).add(1, 'day');
                const start_dates = Contract.startDates();

                const selected_start_day_index = CommonFunctions.getElementById('date_start').selectedIndex;

                let max_date;
                if (start_dates && start_dates.list && start_dates.list.length) {
                    const start_dates_length = start_dates.list.length;
                    start_dates.list.some((date) => {
                        // for the last day we will add +1 day as we don't know if offered or not we let back-end decide
                        if (moment.utc(+date.open * 1000).format('dd') === next_day.format('dd') || selected_start_day_index === start_dates_length) {
                            max_date = next_day;
                            return true;
                        }
                        return false;
                    });
                }
                if (!$expiry_date.is('select')) {
                    $expiry_date.replaceWith($('<select/>', { id: 'expiry_date', 'data-value': toISOFormat(min_date) }));
                    $expiry_date = $('#expiry_date');
                    expiryDateOnChange($expiry_date);
                } else {
                    $expiry_date.empty().attr('data-value', toISOFormat(min_date));
                }
                appendExpiryDateValues($expiry_date, min_date);
                if (max_date) {
                    appendExpiryDateValues($expiry_date, max_date);
                }
                requested = selectEndDate(min_date);
            }
        }
        return requested;
    };

    const appendExpiryDateValues = ($expiry_date, date) => {
        $expiry_date.append($('<option/>', { text: date.format('ddd - DD MMM, YYYY'), 'data-value': toISOFormat(date) }));
    };

    const displayExpiryType = () => {
        const target   = CommonFunctions.getElementById('expiry_type');
        const fragment = document.createDocumentFragment();

        // in case of having endtime as expiry_type and change the form to contract types
        // which only have duration and do not support endtime, it should change the Default value
        // to get corrected based on contract situations
        if ($('#expiry_type').find(`option[value=${Defaults.get('expiry_type')}]`).length === 0 && target.value) {
            Defaults.set('expiry_type', target.value);
        }
        const current_selected = Defaults.get('expiry_type') || target.value || 'duration';

        CommonFunctions.getElementById(`expiry_type_${current_selected}`).style.display = 'flex';
        // need to hide the non selected one
        CommonFunctions.getElementById(`expiry_type_${current_selected === 'duration' ? 'endtime' : 'duration'}`).style.display = 'none';

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        let option = createElement('option', { value: 'duration', text: localize('Duration') });

        if (current_selected === 'duration') {
            option.setAttribute('selected', 'selected');
        }
        fragment.appendChild(option);

        if (has_end_date) {
            option = createElement('option', { value: 'endtime', text: localize('End Time') });
            if (current_selected === 'endtime') {
                option.setAttribute('selected', 'selected');
            }
            fragment.appendChild(option);
        }
        target.appendChild(fragment);
    };

    const isNow = date_start => (date_start ? date_start === 'now' : (!State.get('is_start_dates_displayed') || CommonFunctions.getElementById('date_start').value === 'now'));
    
    const isSameDay = () => {
        const expiry_date  = CommonFunctions.getElementById('expiry_date');
        let date_start_val = CommonFunctions.getElementById('date_start').value;
        // if 'now' is selected, take first option's value
        if (!date_start_val || isNaN(+date_start_val)) {
            date_start_val = window.time;
        } else {
            date_start_val = moment.utc(+date_start_val * 1000);
        }
        const expiry_date_day = moment.utc(expiry_date.getAttribute('data-value'));
        return date_start_val.isSame(expiry_date_day, 'day');
    };

    const selectEndDate = (end_date) => {
        const expiry_time       = CommonFunctions.getElementById('expiry_time');
        const expiry_time_row   = CommonFunctions.getElementById('expiry_time_row');
        const end_date_readable = toReadableFormat(end_date);
        const end_date_iso      = toISOFormat(end_date);
        const $expiry_date      = $('#expiry_date');
        if ($expiry_date.is('input')) {
            $expiry_date.val(end_date_readable)
                .attr('data-value', end_date_iso);
        }
        Defaults.set('expiry_date', end_date_iso);
        if (isNow() && !isSameDay()) {
            Defaults.remove('expiry_time');
            expiry_time_row.hide();
            Barriers.display();
            $(expiry_time).val('').attr('data-value', '');
            Defaults.set('expiry_time', '');
            return processTradingTimesRequest(end_date_iso);
        } // else
        return showExpiryTime(expiry_time, expiry_time_row);
    };

    const hideExpiryTime = (expiry_time) => {
        const requested = setTime('');
        Defaults.remove('expiry_time');
        expiry_time.hide();
        Barriers.display();
        return requested;
    };

    const showExpiryTime = (el_expiry_time = CommonFunctions.getElementById('expiry_time'), el_expiry_time_row = CommonFunctions.getElementById('expiry_time_row')) => {
        const el_time_start = CommonFunctions.getElementById('time_start');
        const is_same_day   = isSameDay();
        let expiry_time_val = el_expiry_time.value;
        let time_start_val  = el_time_start.value;
        let new_time,
            time_changed,
            keep_time_unchanged;
        if (!expiry_time_val) {
            new_time        = moment(window.time);
            expiry_time_val = new_time.format('HH:mm');
        }
        if (!time_start_val) {
            time_start_val = moment(window.time).format('HH:mm');
        }
        if (!is_same_day && expiry_time_val >= time_start_val) {
            const time_start = time_start_val.split(':');
            new_time         = moment(window.time).hour(time_start[0]).minute(time_start[1]);
            if (+time_start[0] === 0 && +time_start[1] === 0) {
                keep_time_unchanged = true;
            } else {
                new_time = new_time.add(-10, 'minutes');
            }
        } else if (is_same_day && expiry_time_val <= time_start_val) {
            const time_start = time_start_val.split(':');
            new_time         = moment(window.time).hour(time_start[0]).minute(time_start[1]);
        }
        if (is_same_day && expiry_time_val < time_start_val) {
            const time = time_start_val.split(':');
            new_time   = moment(window.time).hour(time[0]).minute(time[1]);
        }
        if (new_time) {
            if (!keep_time_unchanged) {
                new_time = new_time.add(5, 'minutes');
            }
            new_time = new_time.utc().format('HH:mm');
            el_expiry_time.value = new_time;
            el_expiry_time.setAttribute('data-value', new_time);
            time_changed = setTime(el_expiry_time.value, 1);
        } else {
            time_changed = setTime(Defaults.get('expiry_time') || el_expiry_time.value);
        }
        Defaults.set('expiry_time', Defaults.get('expiry_time') || el_expiry_time.value);
        el_expiry_time_row.show();
        Barriers.display();
        return time_changed;
    };

    let old_date;
    const processTradingTimesRequest = (date) => {
        if (old_date === date) {
            return false;
        }
        old_date            = date;
        const trading_times = commonIndependent.getTradingTimes();
        if (getPropertyValue(trading_times, date)) {
            Price.processPriceRequest();
        } else {
            commonTrading.showPriceOverlay();
            BinarySocket.send({ trading_times: date }).then((response) => {
                commonIndependent.processTradingTimesAnswer(response);
                Price.processPriceRequest();
            });
        }
        return true;
    };

    const validateMinDurationAmount = () => {
        const duration_amount_element  = CommonFunctions.getElementById('duration_amount');
        const duration_wrapper_element = CommonFunctions.getElementById('duration_wrapper');

        if (!CommonFunctions.isVisible(duration_amount_element)) {
            duration_wrapper_element.setVisibility(0);
            return;
        }

        const duration_min_element = CommonFunctions.getElementById('duration_minimum');
        const duration_max_element = CommonFunctions.getElementById('duration_maximum');
        duration_wrapper_element.setVisibility(1);

        if (+duration_amount_element.value < +duration_min_element.textContent) {
            duration_amount_element.classList.add('error-field');
            duration_wrapper_element.classList.add('error-msg');
        } else if (+duration_max_element.textContent &&
            +duration_amount_element.value > +duration_max_element.textContent) {
            duration_amount_element.classList.add('error-field');
            duration_wrapper_element.classList.remove('error-msg');
        } else {
            duration_amount_element.classList.remove('error-field');
            duration_wrapper_element.classList.remove('error-msg');
        }
    };

    const onStartDateChange = (value) => {
        const $date_start_select = $('#date_start');
        if (!value || !$date_start_select.find(`option[value=${value}]`).length) {
            return 0;
        }

        $date_start_select.val(value);

        $('#time_start_row').setVisibility(value !== 'now');
        const time_start = CommonFunctions.getElementById('time_start');
        if (value === 'now') {
            time_start.value = '';
        } else {
            commonIndependent.checkValidTime(time_start, $date_start_select, Defaults.get('time_start'));
        }

        let make_price_request = 1;
        let requested;
        const displayed = displayDurations(time_start.value);
        if (+displayed > 0) {
            make_price_request = -1;
        } else if (value !== 'now' && Defaults.get('expiry_type') === 'endtime') {
            const end_time     = moment(parseInt(value) * 1000).add(5, 'minutes').utc();
            setTime(Defaults.get('expiry_time') ? Defaults.get('expiry_time') : end_time.format('HH:mm'));
            let expiry_date = Defaults.get('expiry_date') ? moment(Defaults.get('expiry_date')) : '';
            if (expiry_date) {
                const date_start = moment(+$date_start_select.val() * 1000);
                // if chosen end date is not start date or one day after start date, reset its value
                if (expiry_date.format('DDD') !== date_start.format('DDD') && expiry_date.format('DDD') !== date_start.add(1, 'day').format('DDD')) {
                    expiry_date = end_time;
                }
            }
            requested = selectEndDate(expiry_date || end_time);
        } else if (value === 'now' && isSameDay() && Defaults.get('expiry_type') === 'endtime') {
            let expiry_time = Defaults.get('expiry_time') || moment().utc().add(5, 'minutes').format('HH:mm');
            const times = expiry_time.split(':');
            if (times.length > 1) {
                let moment_expiry_time = moment.utc();
                moment_expiry_time = moment_expiry_time.hour(times[0]).minute(times[1]);
                const now = moment.utc();
                if (moment_expiry_time.isBefore(now)) {
                    expiry_time = now.add(5, 'minutes').format('HH:mm');
                }
            }
            requested = setTime(expiry_time);
        } else {
            requested = hideExpiryTime(CommonFunctions.getElementById('expiry_time_row'));
        }
        if (requested) {
            make_price_request = -1;
        }
        commonTrading.timeIsValid($('#expiry_time'));
        return make_price_request;
    };

    const setTime = (time, process_new_time) => {
        const $expiry_time = $('#expiry_time');
        if ($expiry_time.attr('data-value') !== time || $expiry_time.val() !== time || process_new_time) {
            $expiry_time.val(time).attr('data-value', time);
            Defaults.set('expiry_time', time);
            if (commonTrading.timeIsValid($expiry_time)) {
                Price.processPriceRequest();
                return true;
            }
        }
        return false;
    };

    return {
        displayEndTime,
        selectEndDate,
        validateMinDurationAmount,
        onStartDateChange,
        setTime,
        isNow,
        expiryDateOnChange,

        display     : displayDurations,
        populate    : durationPopulate,
        selectAmount: (a) => { selected_duration.amount = a; },
        selectUnit  : (u) => { selected_duration.unit = u; },
    };
})();

module.exports = Durations;
