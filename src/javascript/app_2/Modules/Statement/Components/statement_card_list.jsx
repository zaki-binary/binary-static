import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import PropTypes                      from 'prop-types';
import StatementCard                  from './statement_card.jsx';

const StatementCardList = ({ data, onScroll, children }) => (
    <div className='card-list' onScroll={onScroll}>
        {
            data.map((transaction, id) => (
                <StatementCard className='card-list__card' {...transaction} key={id} />
            ))
        }
        {children}
    </div>
);

StatementCardList.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    data    : MobxPropTypes.arrayOrObservableArray,
    onScroll: PropTypes.func,
};

export default StatementCardList;
