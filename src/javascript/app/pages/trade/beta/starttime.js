const moment           = require('moment');
const Contract_Beta    = require('./contract');
const Durations_Beta   = require('./duration');
const getStartDateNode = require('../common_independent').getStartDateNode;
const Defaults         = require('../defaults');
const getElementById   = require('../../../../_common/common_functions').getElementById;
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const createElement    = require('../../../../_common/utility').createElement;

/*
 * Handles start time display
 *
 * It process `Contract.startDates` in case of forward
 * starting contracts and populate the start time select
 * box
 */

const StartDates_Beta = (() => {
    let has_now = 0;
    State.remove('is_start_dates_displayed');

    const compareStartDate = (a, b) => {
        let sort = 0;
        if (a.date !== b.date) {
            sort = a.date > b.date ? 1 : -1;
        }
        return sort;
    };

    const displayStartDates = () => {
        const start_dates = Contract_Beta.startDates();

        if (start_dates && start_dates.list && start_dates.list.length) {
            const target   = getStartDateNode();
            const fragment = document.createDocumentFragment();
            const row      = getElementById('date_start_row');
            let option,
                first;

            row.style.display = 'flex';

            while (target && target.firstChild) {
                target.removeChild(target.firstChild);
            }

            if (start_dates.has_spot) {
                option = createElement('option', { value: 'now', text: localize('Now') });
                fragment.appendChild(option);
                has_now = 1;
            } else {
                has_now = 0;
            }

            start_dates.list.sort(compareStartDate);

            start_dates.list.forEach((start_date) => {
                let a   = moment.unix(start_date.open).utc();
                const b = moment.unix(start_date.close).utc();

                const rounding = 5 * 60 * 1000;
                const start    = moment.utc();

                if (moment(start).isAfter(moment(a))) {
                    a = start;
                }

                a = moment(Math.ceil((+a) / rounding) * rounding).utc();

                while (a.isBefore(b)) {
                    if (a.unix() - start.unix() > 5 * 60) {
                        option = createElement('option', { value: a.utc().unix(), text: a.format('HH:mm ddd').replace(' ', ' GMT, ') });
                        if (typeof first === 'undefined' && !has_now) {
                            first = a.utc().unix();
                        }
                        if (option.value === Defaults.get('date_start')) {
                            option.setAttribute('selected', 'selected');
                        }
                        fragment.appendChild(option);
                    }
                    a.add(5, 'minutes');
                }
            });
            target.appendChild(fragment);
            Defaults.set('date_start', target.value);
            State.set('is_start_dates_displayed', true);
            if (first) {
                Durations_Beta.onStartDateChange(first);
            }
        } else {
            State.remove('is_start_dates_displayed');
            getElementById('date_start_row').style.display = 'none';
            Defaults.remove('date_start');
        }
    };

    return {
        display: displayStartDates,
        disable: () => { getStartDateNode().setAttribute('disabled', 'disabled'); },
        enable : () => { getStartDateNode().removeAttribute('disabled'); },
    };
})();

module.exports = StartDates_Beta;
