import {
    AssetInformation,
    ChartTitle }      from '@binary-com/smartcharts';
import PropTypes      from 'prop-types';
import React          from 'react';

const TopWidgets = ({
    InfoBox,
    is_title_enabled = true,
    onSymbolChange,
}) => (
    <React.Fragment>
        {InfoBox}
        <ChartTitle enabled={is_title_enabled} onChange={onSymbolChange} />
        <AssetInformation />
    </React.Fragment>
);

TopWidgets.propTypes = {
    InfoBox         : PropTypes.node,
    is_title_enabled: PropTypes.bool,
    onSymbolChange  : PropTypes.func,
};

export default TopWidgets;
