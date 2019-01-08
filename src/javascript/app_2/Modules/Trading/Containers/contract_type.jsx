import PropTypes          from 'prop-types';
import React              from 'react';
import { connect }        from 'Stores/connect';
import ContractTypeWidget from '../Components/Form/ContractType/contract_type_widget.jsx';

const Contract = ({
    contract_type,
    contract_types_list,
    onChange,
    is_mobile,
}) => (
    <ContractTypeWidget
        name='contract_type'
        list={contract_types_list}
        value={contract_type}
        onChange={onChange}
        is_mobile={is_mobile}
    />
);

Contract.propTypes = {
    contract_type      : PropTypes.string,
    contract_types_list: PropTypes.object,
    is_mobile          : PropTypes.bool,
    onChange           : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        contract_type      : modules.trade.contract_type,
        contract_types_list: modules.trade.contract_types_list,
        onChange           : modules.trade.onChange,
        is_mobile          : ui.is_mobile,
    })
)(Contract);
