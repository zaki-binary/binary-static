import React from 'react';
import Loading from '../../_common/components/loading.jsx';
import DerivBanner from '../../_common/components/deriv_banner.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const MetaTraderTerminal = () => (
    <React.Fragment>
        <div id='metatrader_webterminal' className='static_full'>
            <DerivBanner />
            <div id='webterminal' style={{ width: '100%' , height: '600px' }}>
                <Loading />
            </div>
        </div>
        <SeparatorLine className='gr-padding-10' invisible />
    </React.Fragment>
);

export default MetaTraderTerminal;
