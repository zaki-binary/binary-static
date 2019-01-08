import PropTypes    from 'prop-types';
import React        from 'react';
import ScreenLarge  from './screen_large.jsx';
import ScreenSmall  from './screen_small.jsx';

const FormLayout = ({
    is_contract_visible,
    is_mobile,
    is_trade_enabled,
}) => (
    is_mobile ?
        <ScreenSmall
            is_trade_enabled={is_trade_enabled}
        />
        :
        <ScreenLarge
            is_contract_visible={is_contract_visible}
            is_trade_enabled={is_trade_enabled}
        />
);

FormLayout.propTypes = {
    is_contract_visible: PropTypes.bool,
    is_mobile          : PropTypes.bool,
    is_trade_enabled   : PropTypes.bool,
};

export default FormLayout;
