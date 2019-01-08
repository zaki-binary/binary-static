import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { IconTradeCategory }          from 'Assets/Trading/Categories';

const ContractTypeItem = ({
    contracts,
    name,
    value,
    handleSelect,
}) => (
    contracts.map((contract, idx) => (
        <div
            key={idx}
            className={`list-item ${value === contract.value ? 'selected' : ''}`}
            name={name}
            value={contract.value}
            onClick={() => handleSelect(contract)}
        >
            <IconTradeCategory category={contract.value} />
            <span className='contract-title'>
                {contract.text}
            </span>
        </div>
    ))
);

ContractTypeItem.propTypes = {
    contracts   : MobxPropTypes.arrayOrObservableArray,
    handleSelect: PropTypes.func,
    name        : PropTypes.string,
    value       : PropTypes.string,
};

export default ContractTypeItem;
