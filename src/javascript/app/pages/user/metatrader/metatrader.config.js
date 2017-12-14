const Client       = require('../../../base/client');
const GTM          = require('../../../base/gtm');
const BinarySocket = require('../../../base/socket');
const formatMoney  = require('../../../common/currency').formatMoney;
const localize     = require('../../../../_common/localize').localize;
const State        = require('../../../../_common/storage').State;
const urlFor       = require('../../../../_common/url').urlFor;

const MetaTraderConfig = (() => {
    const mt_companies = {
        financial: {
            cent    : { mt5_account_type: 'cent',     max_leverage: 1000, title: 'Cent' },
            standard: { mt5_account_type: 'standard', max_leverage: 300,  title: 'Standard' },
            stp     : { mt5_account_type: 'stp',      max_leverage: 100,  title: 'STP' },
        },
        gaming: {
            volatility: { mt5_account_type: '', max_leverage: 500, title: 'Volatility' },
        },
    };

    const accounts_info = {};

    const needsRealMessage = () => $(`#msg_${Client.hasAccountType('real') ? 'switch' : 'upgrade'}`).html();

    const actions_info = {
        new_account: {
            title        : localize('Sign up'),
            login        : response => response.mt5_new_account.login,
            prerequisites: acc_type => (
                new Promise((resolve) => {
                    if (accounts_info[acc_type].is_demo) {
                        resolve();
                    } else if (Client.get('is_virtual')) {
                        resolve(needsRealMessage());
                    } else if (accounts_info[acc_type].account_type === 'financial') {
                        BinarySocket.wait('get_account_status').then((response_get_account_status) => {
                            const $message = $('#msg_real_financial').clone();
                            let is_ok = true;
                            if (/financial_assessment_not_complete/.test(response_get_account_status.get_account_status.status)) {
                                $message.find('.assessment').setVisibility(1).find('a').attr('onclick', `localStorage.setItem('financial_assessment_redirect', '${urlFor('user/metatrader')}')`);
                                is_ok = false;
                            }
                            if (response_get_account_status.get_account_status.prompt_client_to_authenticate) {
                                $message.find('.authenticate').setVisibility(1);
                                is_ok = false;
                            }
                            resolve(is_ok ? '' : $message.html());
                        });
                    } else {
                        resolve();
                    }
                })
            ),
            onSuccess: (response) => {
                GTM.mt5NewAccount(response);
            },
        },
        password_change: {
            title        : localize('Change Password'),
            success_msg  : response => localize('The main password of account number [_1] has been changed.', [response.echo_req.login]),
            prerequisites: () => new Promise(resolve => resolve('')),
        },
        deposit: {
            title      : localize('Deposit'),
            success_msg: response => localize('[_1] deposit from [_2] to account number [_3] is done. Transaction ID: [_4]', [
                formatMoney(State.getResponse('authorize.currency'), response.echo_req.amount),
                response.echo_req.from_binary,
                response.echo_req.to_mt5,
                response.binary_transaction_id,
            ]),
            prerequisites: () => new Promise((resolve) => {
                if (Client.get('is_virtual')) {
                    resolve(needsRealMessage());
                } else {
                    BinarySocket.send({ cashier_password: 1 }).then((response) => {
                        if (!response.error && response.cashier_password === 1) {
                            resolve(localize('Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.', [
                                urlFor('user/security/cashier_passwordws')]));
                        } else {
                            resolve();
                        }
                    });
                }
            }),
        },
        withdrawal: {
            title      : localize('Withdraw'),
            success_msg: response => localize('[_1] withdrawal from account number [_2] to [_3] is done. Transaction ID: [_4]', [
                formatMoney(State.getResponse('authorize.currency'), response.echo_req.amount),
                response.echo_req.from_mt5,
                response.echo_req.to_binary,
                response.binary_transaction_id,
            ]),
            prerequisites: acc_type => new Promise((resolve) => {
                if (Client.get('is_virtual')) {
                    resolve(needsRealMessage());
                } else if (accounts_info[acc_type].account_type === 'financial') {
                    BinarySocket.send({ get_account_status: 1 }).then((response_status) => {
                        // There are cases that prompt_client_to_authenticate=0
                        // but websocket returns authentication required error when trying to withdraw
                        // so we check for 'authenticated' status as well to display a user friendly message instead
                        resolve(+response_status.get_account_status.prompt_client_to_authenticate || !/authenticated/.test(response_status.get_account_status.status) ?
                            $('#msg_authenticate').html() : '');
                    });
                } else {
                    resolve();
                }
            }),
            pre_submit: ($form, acc_type, displayFormMessage) => (
                BinarySocket.send({
                    mt5_password_check: 1,
                    login             : accounts_info[acc_type].info.login,
                    password          : $form.find(fields.withdrawal.txt_main_pass.id).val(),
                }).then((response) => {
                    if (+response.mt5_password_check === 1) {
                        return true;
                    } else if (response.error) {
                        displayFormMessage(response.error.message, 'withdrawal');
                    }
                    return false;
                })
            ),
        },
    };

    const fields = {
        new_account: {
            txt_name         : { id: '#txt_name',          request_field: 'name' },
            txt_main_pass    : { id: '#txt_main_pass',     request_field: 'mainPassword' },
            txt_re_main_pass : { id: '#txt_re_main_pass' },
            txt_investor_pass: { id: '#txt_investor_pass', request_field: 'investPassword' },
            chk_tnc          : { id: '#chk_tnc' },
            additional_fields:
                acc_type => ($.extend(
                    {
                        account_type: accounts_info[acc_type].account_type,
                        email       : Client.get('email'),
                        leverage    : accounts_info[acc_type].max_leverage,
                    },
                    accounts_info[acc_type].mt5_account_type ? {
                        mt5_account_type: accounts_info[acc_type].mt5_account_type,
                    } : {})),
        },
        password_change: {
            txt_old_password   : { id: '#txt_old_password', request_field: 'old_password' },
            txt_new_password   : { id: '#txt_new_password', request_field: 'new_password' },
            txt_re_new_password: { id: '#txt_re_new_password' },
            additional_fields  :
                acc_type => ({
                    login: accounts_info[acc_type].info.login,
                }),
        },
        deposit: {
            txt_amount       : { id: '#txt_amount_deposit', request_field: 'amount' },
            additional_fields:
                acc_type => ({
                    from_binary: Client.get('loginid'),
                    to_mt5     : accounts_info[acc_type].info.login,
                }),
        },
        withdrawal: {
            txt_amount       : { id: '#txt_amount_withdrawal', request_field: 'amount' },
            txt_main_pass    : { id: '#txt_main_pass' },
            additional_fields:
                acc_type => ({
                    from_mt5 : accounts_info[acc_type].info.login,
                    to_binary: Client.get('loginid'),
                }),
        },
    };

    const validations = {
        new_account: [
            { selector: fields.new_account.txt_name.id,          validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]] },
            { selector: fields.new_account.txt_main_pass.id,     validations: ['req', ['password', 'mt']] },
            { selector: fields.new_account.txt_re_main_pass.id,  validations: ['req', ['compare', { to: fields.new_account.txt_main_pass.id }]] },
            { selector: fields.new_account.txt_investor_pass.id, validations: ['req', ['password', 'mt'], ['not_equal', { to: fields.new_account.txt_main_pass.id, name1: 'Main password', name2: 'Investor password' }]] },
        ],
        password_change: [
            { selector: fields.password_change.txt_old_password.id,    validations: ['req'] },
            { selector: fields.password_change.txt_new_password.id,    validations: ['req', ['password', 'mt'], ['not_equal', { to: fields.password_change.txt_old_password.id, name1: 'Current password', name2: 'New password' }]], re_check_field: fields.password_change.txt_re_new_password.id },
            { selector: fields.password_change.txt_re_new_password.id, validations: ['req', ['compare', { to: fields.password_change.txt_new_password.id }]] },
        ],
        deposit: [
            { selector: fields.deposit.txt_amount.id, validations: ['req', ['number', { type: 'float', min: 1, max: 20000, decimals: 2 }], ['custom', { func: () => (Client.get('balance') && (+Client.get('balance') >= +$(fields.deposit.txt_amount.id).val())), message: localize('You have insufficient funds in your Binary account, please <a href="[_1]">add funds</a>.', [urlFor('cashier')]) }]] },
        ],
        withdrawal: [
            { selector: fields.withdrawal.txt_main_pass.id, validations: ['req'] },
            { selector: fields.withdrawal.txt_amount.id,    validations: ['req', ['number', { type: 'float', min: 1, max: 20000, decimals: 2 }]] },
        ],
    };

    return {
        mt_companies,
        accounts_info,
        actions_info,
        fields,
        validations,
        needsRealMessage,
        mt5Currency: () => 'USD',
    };
})();

module.exports = MetaTraderConfig;
