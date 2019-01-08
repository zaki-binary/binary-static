import classNames         from 'classnames';
import moment             from 'moment';
import React              from 'react';
import CalendarPanelTypes from './types';

export const CalendarDecades = ({ calendar_date, isPeriodDisabled, onClick, selected_date }) => {
    const selected_year = moment.utc(selected_date).year();
    const moment_date   = moment.utc(calendar_date);

    const decades = [];
    let min_year  = moment_date.year() - 10;
    for (let i = 0; i < 12; i++) {
        const max_year = min_year + 9;
        const range    = `${min_year}-${max_year}`;
        decades.push(range);
        min_year = max_year + 1;
    }

    return (
        <div className='calendar-decade-panel'>
            {decades.map((range, idx) => {
                const [start_year, end_year] = range.split('-');
                return (
                    <span
                        key={idx}
                        className={classNames('calendar-decade', {
                            disabled: isPeriodDisabled(moment_date.year(start_year), 'year') && isPeriodDisabled(moment_date.year(end_year), 'year'),
                            active  : start_year === selected_year,
                        })}
                        onClick={onClick.decade}
                        data-decade={range}
                    >
                        {range}
                    </span>
                );
            })}
        </div>
    );
};

CalendarDecades.propTypes = { ...CalendarPanelTypes };
