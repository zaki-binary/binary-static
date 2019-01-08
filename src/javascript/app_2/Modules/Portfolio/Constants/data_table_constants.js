import React            from 'react';
import { localize }     from '_common/localize';
import Money            from 'App/Components/Elements/money.jsx';
import RemainingTime    from 'App/Containers/remaining_time.jsx';
import ContractTypeCell from '../Components/contract_type_cell.jsx';
import IndicativeCell   from '../Components/indicative_cell.jsx';

/* eslint-disable react/display-name, react/prop-types */
export const getTableColumnsTemplate = (currency) => [
    {
        title            : localize('Reference No.'),
        col_index        : 'reference',
        renderCellContent: ({ cell_value, is_footer }) => (
            is_footer ? localize('Total') : cell_value
        ),
    },
    {
        title            : localize('Contract Type'),
        col_index        : 'type',
        renderCellContent: ({ cell_value, is_footer }) => {
            if (is_footer) return '';
            return <ContractTypeCell type={cell_value} />;
        },
    },
    {
        title    : localize('Contract Details'),
        col_index: 'details',
    },
    {
        title            : localize('Remaining Time'),
        col_index        : 'expiry_time',
        renderCellContent: ({ cell_value, is_footer }) => is_footer ? '' : <RemainingTime end_time={cell_value} />,
    },
    {
        title            : localize('Potential Payout'),
        col_index        : 'payout',
        renderCellContent: ({ cell_value }) => (
            <Money amount={cell_value} currency={currency} />
        ),
    },
    {
        title            : localize('Purchase'),
        col_index        : 'purchase',
        renderCellContent: ({ cell_value }) => (
            <Money amount={cell_value} currency={currency} />
        ),
    },
    {
        title            : localize('Indicative'),
        col_index        : 'indicative',
        renderCellContent: ({ cell_value, row_obj }) => (
            <IndicativeCell amount={+cell_value} currency={currency} status={row_obj.status} />
        ),
    },
];
/* eslint-enable react/display-name, react/prop-types */
