const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const BinarySocket       = require('../../base/socket');
const Currency           = require('../../common/currency');
const FormManager        = require('../../common/form_manager');
const elementTextContent = require('../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../_common/common_functions').getElementById;
const localize           = require('../../../_common/localize').localize;
const State              = require('../../../_common/storage').State;
const createElement      = require('../../../_common/utility').createElement;
const getPropertyValue   = require('../../../_common/utility').getPropertyValue;

const AccountTransfer = (() => {
    const form_id       = 'frm_account_transfer';
    const form_id_hash  = `#${form_id}`;

    const messages = {
        parent : 'client_message',
        error  : 'no_account',
        balance: 'not_enough_balance',
        deposit: 'no_balance',
        limit  : 'limit_reached',
    };

    let el_transfer_from,
        el_transfer_to,
        el_reset_transfer,
        el_transfer_fee,
        el_fee_amount,
        el_fee_minimum,
        el_transfer_info,
        el_success_form,
        exchange_rates,
        curr_account_to,
        client_balance,
        client_currency,
        client_loginid,
        withdrawal_limit;

    const populateAccounts = (accounts) => {
        client_loginid   = Client.get('loginid');
        el_transfer_from = getElementById('lbl_transfer_from');
        el_transfer_to   = getElementById('transfer_to');

        elementTextContent(el_transfer_from, `${client_loginid} ${client_currency ? `(${client_currency})` : ''}`);

        const fragment_transfer_to = document.createElement('div');

        accounts.forEach((account) => {
            if (Client.canTransferFunds(account)) {
                const option = document.createElement('option');
                option.setAttribute('data-currency', account.currency);
                option.appendChild(document.createTextNode(`${account.loginid}${account.currency ? ` (${account.currency})` : ''}`));
                fragment_transfer_to.appendChild(option);
            }
        });

        if (!fragment_transfer_to.childElementCount) {
            showError();
            return;
        }
        if (fragment_transfer_to.childElementCount > 1) {
            el_transfer_to.innerHTML = fragment_transfer_to.innerHTML;
            el_transfer_to.onchange = () => {
                const to_currency = el_transfer_to.options[el_transfer_to.selectedIndex].getAttribute('data-currency');
                el_transfer_info.setVisibility(client_currency !== to_currency);
                setTransferFeeAmount();
            };
        } else {
            const label = createElement('label', {
                'data-value'   : fragment_transfer_to.innerText,
                'data-currency': fragment_transfer_to.firstChild.getAttribute('data-currency'),
            });
            label.appendChild(document.createTextNode(fragment_transfer_to.innerText));
            label.id = 'transfer_to';

            // fix for dropdown select not removed when switching from fiat to BCH
            if (/select/.test(el_transfer_to.parentNode.classList)) {
                el_transfer_to.parentNode.replaceWith(label);
            } else {
                el_transfer_to.parentNode.replaceChild(label, el_transfer_to);
            }
            el_transfer_to = getElementById('transfer_to');
        }

        showForm();

        if (Client.hasCurrencyType('crypto') && Client.hasCurrencyType('fiat')) {
            setTransferFeeAmount();
            elementTextContent(el_fee_minimum, Currency.getMinimumTransferFee(client_currency));
            el_transfer_fee.setVisibility(1);
        } else {
            const to_currency = el_transfer_to.getAttribute('data-currency');
            el_transfer_info.setVisibility(client_currency !== to_currency);
        }
    };

    const setTransferFeeAmount = () => {
        elementTextContent(el_fee_amount, Currency.getTransferFee(client_currency, (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').match(/\((\w+)\)/)[1]));
    };

    const hasError = (response) => {
        const error = response.error;
        if (error) {
            const el_error = getElementById('error_message').getElementsByTagName('p')[0];
            elementTextContent(el_error, error.message);
            if (el_error.parentNode) {
                el_error.parentNode.setVisibility(1);
            }
            return true;
        }
        return false;
    };

    const showError = () => {
        getElementById(messages.parent).setVisibility(1);
        getElementById(messages.error).setVisibility(1);
    };

    const showForm = () => {
        elementTextContent(document.querySelector(`${form_id_hash} #currency`), client_currency);

        getElementById(form_id).setVisibility(1);

        FormManager.init(form_id_hash, [
            { selector: '#amount', validations: [['req', { hide_asterisk: true }], ['number', { type: 'float', decimals: Currency.getDecimalPlaces(client_currency), min: Currency.getMinTransfer(client_currency), max: Math.min(+withdrawal_limit, +client_balance), format_money: true }]] },

            { request_field: 'transfer_between_accounts', value: 1 },
            { request_field: 'account_from',              value: client_loginid },
            { request_field: 'account_to',                value: () => (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').split(' (')[0] },
            { request_field: 'currency',                  value: client_currency },
        ]);

        FormManager.handleSubmit({
            form_selector       : form_id_hash,
            fnc_response_handler: responseHandler,
            enable_button       : true,
        });
    };

    const responseHandler = (response) => {
        if (response.error) {
            const el_error = getElementById('form_error');
            elementTextContent(el_error, response.error.message);
            el_error.setVisibility(1);
            // Auto hide error after 5 seconds.
            setTimeout(() => el_error.setVisibility(0), 5000);
        } else {
            BinarySocket.send({ transfer_between_accounts: 1 }).then(data => populateReceipt(response, data));
        }
    };

    const populateReceipt = (response_submit_success, response) => {
        getElementById(form_id).setVisibility(0);

        elementTextContent(getElementById('from_loginid'), client_loginid);
        elementTextContent(getElementById('to_loginid'), response_submit_success.client_to_loginid);

        response.accounts.forEach((account) => {
            if (account.loginid === client_loginid) {
                elementTextContent(getElementById('from_currency'), account.currency);
                elementTextContent(getElementById('from_balance'), account.balance);
            } else if (account.loginid === response_submit_success.client_to_loginid) {
                elementTextContent(getElementById('to_currency'), account.currency);
                elementTextContent(getElementById('to_balance'), account.balance);
            }
        });

        el_transfer_fee.setVisibility(0);
        el_transfer_info.setVisibility(0);
        el_success_form.setVisibility(1);
        window.scrollTo(0, 0);
    };

    const onAmountInput = (e) => {
        const input_val = parseFloat(e.target.value);
        calculateAmount(input_val);
    };

    const calculateAmount = () => {
        const el_amount_value    = parseFloat(getElementById('amount').value);
        const exchange_rate      = getExchangeRates();
        const min_transfer_fee   = parseFloat((Currency.getMinimumTransferFee(client_currency).substring(4)));
        const transfer_fee       = parseFloat(Currency.getTransferFee(client_currency, curr_account_to).slice(0, -1));
        const transfer_fee_value = () => {
            const percentage_transfer_fee = ((transfer_fee / 100) * el_amount_value);
            if (percentage_transfer_fee > min_transfer_fee) {
                return percentage_transfer_fee;
            }
            return min_transfer_fee;
        };

        const transfer_total_value = (el_amount_value - transfer_fee_value()) * exchange_rate;

        if (!isNaN(transfer_total_value)) {
            elementTextContent(getElementById('transfer_fee_lbl'), `${client_currency} ${transfer_fee_value().toFixed(Currency.getDecimalPlaces(client_currency))}`);
            elementTextContent(getElementById('total_lbl'), `${curr_account_to} ${transfer_total_value.toFixed(Currency.getDecimalPlaces(curr_account_to))}`);
        } else {
            elementTextContent(getElementById('transfer_fee_lbl'), `${client_currency} 0`);
            elementTextContent(getElementById('total_lbl'), `${curr_account_to} 0`);
        }
    };

    const getExchangeRates = () => getPropertyValue(exchange_rates, curr_account_to);

    const updateExchangeMessage = () => {
        elementTextContent(getElementById('exchange_rate'), `${client_currency} 1 = ${getExchangeRates()} ${curr_account_to}`);
    };

    const onAccountToChange = (e) => {
        const el_amount = getElementById('amount');
        curr_account_to = (e.target.value || e.target.getAttribute('data-value') || '').match(/\((.*)\)/)[1];
        calculateAmount(parseFloat(el_amount.value));
        updateExchangeMessage();
    };

    const populateExchangeRate = () => {
        curr_account_to = (el_transfer_to.value || el_transfer_to.getAttribute('data-value') || '').match(/\((.*)\)/)[1];
        updateExchangeMessage();
        getElementById('amount').addEventListener('input', onAmountInput);
        getElementById('transfer_to').addEventListener('change', onAccountToChange);
        elementTextContent(getElementById('transfer_fee_lbl'), `${client_currency} 0`);
        elementTextContent(getElementById('total_lbl'), `${curr_account_to} 0`);
    };

    const onClickReset = () => {
        el_success_form.setVisibility(0);
        getElementById('amount').value = '';
        elementTextContent(getElementById('transfer_fee_lbl'), `${client_currency} 0`);
        elementTextContent(getElementById('total_lbl'), `${curr_account_to} 0`);
        getElementById('success_header').setVisibility(0);
        getElementById('transfer_header').setVisibility(1);
        onLoad();
    };

    const onLoad = () => {
        if (!Client.canTransferFunds()) {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        el_transfer_fee   = getElementById('transfer_fee');
        el_fee_amount     = getElementById('transfer_fee_amount');
        el_fee_minimum    = getElementById('transfer_fee_minimum');
        el_transfer_info  = getElementById('transfer_info');
        el_success_form   = getElementById('success_form');
        el_reset_transfer = getElementById('reset_transfer');
        el_reset_transfer.addEventListener('click', onClickReset);

        BinarySocket.wait('balance').then((response) => {
            client_balance   = +getPropertyValue(response, ['balance', 'balance']);
            client_currency  = Client.get('currency');

            BinarySocket.send({ exchange_rates: 1, base_currency: client_currency }).then((data) => {
                exchange_rates = data.exchange_rates.rates;
            });

            const min_amount = Currency.getMinTransfer(client_currency);
            if (!client_balance || client_balance < +min_amount) {
                getElementById(messages.parent).setVisibility(1);
                if (client_currency) {
                    elementTextContent(getElementById('min_required_amount'), `${client_currency} ${min_amount}`);
                    getElementById(messages.balance).setVisibility(1);
                }
                getElementById(messages.deposit).setVisibility(1);
            } else {
                const req_transfer_between_accounts = BinarySocket.send({ transfer_between_accounts: 1 });
                const req_get_limits                = BinarySocket.send({ get_limits: 1 });

                Promise.all([req_transfer_between_accounts, req_get_limits]).then(() => {
                    const response_transfer = State.get(['response', 'transfer_between_accounts']);
                    const response_limits   = State.get(['response', 'get_limits']);

                    if (hasError(response_transfer)) {
                        return;
                    }
                    const accounts = response_transfer.accounts;
                    if (!accounts || !accounts.length) {
                        showError();
                        return;
                    }
                    if (hasError(response_limits)) {
                        return;
                    }
                    withdrawal_limit = +response_limits.get_limits.remainder;
                    if (withdrawal_limit < +min_amount) {
                        getElementById(messages.limit).setVisibility(1);
                        getElementById(messages.parent).setVisibility(1);
                        return;
                    }
                    getElementById('range_hint').textContent = `${localize('Min')}: ${min_amount} ${localize('Max')}: ${client_balance <= withdrawal_limit ? localize('Current balance') : localize('Withdrawal limit')}`;
                    populateAccounts(accounts);
                    populateExchangeRate();
                });
            }
        });
    };

    const onUnload = () => {
        if (el_reset_transfer) el_reset_transfer.removeEventListener('click', onClickReset);
        getElementById('amount').removeEventListener('input', onAmountInput);
        getElementById('transfer_to').removeEventListener('change', onAccountToChange);
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = AccountTransfer;
