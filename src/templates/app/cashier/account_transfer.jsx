import React from 'react';
import { FormRow, SubmitButton, Fieldset } from '../../_common/components/forms.jsx';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const Row = ({ id }) => (
    <div className='gr-padding-10 gr-push-2 gr-row'>
        <div className='gr-2 gr-4-m align-end'>
            <span id={`${id}_loginid`} />
        </div>
        <div className='gr-10 gr-8-m'>
            <span id={`${id}_currency`} />&nbsp;<span id={`${id}_balance`} />
        </div>
    </div>
);

const AccountTransfer = () => (
    <React.Fragment>
        <div id='success_header' className='invisible'>
            <div className='center-text'>
                <span id='success_header_icon' />
            </div>
            <h1 id='success_transfer_header_text' className='center-text'>{it.L('Transfer successful')}</h1>
        </div>

        <h1 id='transfer_header'>{it.L('Transfer Between Accounts')}</h1>

        <div className='invisible' id='client_message'>
            <p className='center-text notice-msg'>
                <span className='invisible' id='no_account'>{it.L('Fund transfers between accounts are unavailable.')}&nbsp;</span>
                <span className='invisible' id='not_enough_balance'>
                    {it.L('The minimum required amount for using the account transfer facility is [_1].', '<span id="min_required_amount"></span>')}
                    &nbsp;
                </span>
                <span className='invisible' id='no_balance'>
                    {it.L('Please [_1]deposit[_2] to your account.', `<a href='${it.url_for('cashier/forwardws?action=deposit')}'>`, '</a>')}
                    &nbsp;
                </span>
                <span className='invisible' id='limit_reached'>{it.L('You have reached your withdrawal limit.')}&nbsp;</span>
            </p>
        </div>

        <div className='invisible' id='error_message'>
            <p className='center-text notice-msg' />
        </div>

        <div className='invisible' id='success_form'>
            <p className='gr-padding-10 center-text'>{it.L('Your account balances have been updated:')}</p>
            <Fieldset legend={it.L('Details')} className='gr-padding-20'>
                <Row id='from' />
                <Row id='to' />
            </Fieldset>
            <p className='gr-padding-10 center-text'>
                {it.L('Please see [_1]your account statement page[_2] for further details of each transfer.', `<a href='${it.url_for('user/statementws')}'>`, '</a>')}
            </p>
            <p className='center-text'>
                <a className='button' href='javascript:;' id='reset_transfer'><span>{it.L('Make another transfer')}</span></a>
            </p>

            <SeparatorLine className='gr-padding-10' invisible />
        </div>

        <form className='invisible' id='frm_account_transfer'>
            <p>{it.L('Transfer funds between your real money accounts.')}</p>

            <Fieldset legend={it.L('From')}>
                <FormRow label={it.L('Transfer from')} type='label'  id='lbl_transfer_from' />
                <FormRow label={it.L('Amount')} type='custom' id='transfer_amount'>
                    <label id='currency' />
                    <input id='amount' name='amount' type='text' maxLength='20' autoComplete='off' data-lpignore />
                    <div className='hint' id='range_hint' />
                </FormRow>
            </Fieldset>
            <Fieldset legend={it.L('To')}>
                <FormRow label={it.L('Transfer to')} type='select' id='transfer_to' />
                <FormRow label={it.L('Exchange Rate')} type='custom' id='transfer_amount'>
                    <span id='exchange_rate' />
                </FormRow>
            </Fieldset>
            <Fieldset legend={it.L('Details')}>
                <FormRow label={it.L('Transfer fee')} type='label' id='transfer_fee_lbl' />
                <FormRow label={it.L('Total amount received')} type='label' id='total_lbl' />
            </Fieldset>

            <SubmitButton msg_id='form_error' type='submit' text={it.L('Transfer')} is_centered />

            <SeparatorLine />
        </form>

        <div className='hint invisible' id='transfer_fee'>
            {it.L('Notes:')}
            <ul className='bullet'>
                <li>{it.L('Transfer between accounts is not available on weekends')}</li>
                <li>{it.L('You may only transfer funds between a fiat account and a cryptocurrency account')}</li>
                <li>{it.L('Each transfer is subject to a [_1] transfer fee or a minimum fee of [_2], whichever is higher.', '<span id="transfer_fee_amount"></span>', '<span id="transfer_fee_minimum"></span>')}</li>
                <li>{it.L('Authorised payment agents are exempted from paying any transfer fees')}</li>
            </ul>
        </div>
    </React.Fragment>
);

export default AccountTransfer;
