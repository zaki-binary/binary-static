import PropTypes           from 'prop-types';
import React               from 'react';
import ContractTypeCell    from 'Modules/Portfolio/Components/contract_type_cell.jsx';
import Money               from '../money.jsx';
import BinaryLink          from '../../Routes/binary_link.jsx';
import { getContractPath } from '../../Routes/helpers';
import RemainingTime       from '../../../Containers/remaining_time.jsx';

const PortfolioDrawerCard = ({
    currency,
    expiry_time,
    id,
    indicative,
    status,
    type,
    underlying,
}) => (
    <BinaryLink className='portfolio-drawer-card' to={getContractPath(id)}>
        <React.Fragment>
            <div className='portfolio-drawer-card__type'>
                <ContractTypeCell type={type} />
            </div>
            <div className={`portfolio-drawer-card__indicative portfolio-drawer-card__indicative--${status}`}>
                <Money amount={indicative} currency={currency} />
            </div>
            <span className='portfolio-drawer-card__symbol'>{underlying}</span>
            <span className='portfolio-drawer-card__remaining-time'>
                <RemainingTime end_time={expiry_time} />
            </span>
        </React.Fragment>
    </BinaryLink>
);

PortfolioDrawerCard.propTypes = {
    currency   : PropTypes.string,
    expiry_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    id        : PropTypes.number,
    indicative: PropTypes.number,
    status    : PropTypes.string,
    type      : PropTypes.string,
    underlying: PropTypes.string,
};

export default PortfolioDrawerCard;
