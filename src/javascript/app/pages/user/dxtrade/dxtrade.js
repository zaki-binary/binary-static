const DXTradeConfig   = require('./dxtrade.config');
const DXTradeUI          = require('./dxtrade.ui');
const Client             = require('../../../base/client');
const BinarySocket       = require('../../../base/socket');
const setCurrencies      = require('../../../common/currency').setCurrencies;
const Validation         = require('../../../common/form_validation');
const localize           = require('../../../../_common/localize').localize;
const State              = require('../../../../_common/storage').State;
const applyToAllElements = require('../../../../_common/utility').applyToAllElements;

const DXTrade = (() => {
    let show_new_account_popup = true;

    const accounts_info = DXTradeConfig.accounts_info;
    const actions_info  = DXTradeConfig.actions_info;
    const fields        = DXTradeConfig.fields;

    const onLoad = () => {
        BinarySocket.send({ statement: 1, limit: 1 });
        BinarySocket.wait('landing_company', 'get_account_status', 'statement').then(async () => {
            if (isEligible()) {
                if (Client.get('is_virtual')) {
                    addAllAccounts();
                } else {
                    BinarySocket.send({ get_limits: 1 }).then(addAllAccounts);
                }
            } else {
                DXTradeUI.displayPageError(localize('Sorry, this feature is not available in your jurisdiction.'));
            }
        });
    };

    const isEligible = () => {
        const landing_company = State.getResponse('landing_company');
        // hide MT5 dashboard for IOM account or VRTC of IOM landing company
        if (State.getResponse('landing_company.gaming_company.shortcode') === 'iom' && !Client.isAccountOfType('financial')) {
            return false;
        }
        return 'mt_gaming_company' in landing_company || 'mt_financial_company' in landing_company;
    };

    const addAllAccounts = () => {
        BinarySocket.wait('mt5_login_list').then((response) => {
            if (response.error) {
                DXTradeUI.displayPageError(response.error.message);
                return;
            }

            // const valid_account = Object.values(response.mt5_login_list).filter(acc => !acc.error);

            // if (has_multi_mt5_accounts && (has_demo_error || has_real_error)) {
            //     const { account_type, market_type, sub_account_type } = valid_account[0];
            //     current_acc_type = `${account_type}_${market_type}_${sub_account_type}`;
            // }

            const { mt_financial_company, mt_gaming_company } = State.getResponse('landing_company');
            addAccount('gaming', mt_gaming_company);
            addAccount('financial', mt_financial_company);
            // TODO: Remove once details in inaccessible error provides necessary accounts info
            addAccount('unknown', null);

            response.mt5_login_list.forEach((mt5_login) => {

                if (mt5_login.error) {
                    const { account_type } = mt5_login.error.details;
                    let message = mt5_login.error.message_to_client;
                    switch (mt5_login.error.code) {
                        case 'MT5AccountInaccessible': {
                            DXTrade.setDisabledAccountTypes({
                                'real': account_type === 'real',
                                'demo': account_type === 'demo',
                            });
                            message = localize('Due to an issue on our server, some of your MT5 accounts are unavailable at the moment. [_1]Please bear with us and thank you for your patience.', '<br />');
                            break;
                        }
                        default:
                            break;
                    }

                    DXTrade.displayPageError(message);

                } else {
                    const landing_company = mt5_login.market_type === 'gaming' ? mt_gaming_company : mt_financial_company;
                    addAccount(mt5_login.market_type, landing_company);
                }
            });

            getAllAccountsInfo(response);
        });
    };

    // * mt5_login_list returns these:
    // landing_company_short: "svg" | "malta" | "maltainvest" |  "vanuatu"  | "labuan" | "bvi"
    // account_type: "real" | "demo"
    // market_type: "financial" | "gaming"
    // sub_account_type: "financial" | "financial_stp" | "swap_free"
    //
    // (all market type gaming are synthetic accounts and can only have financial or swap_free sub account)
    //
    // * we should map them to landing_company:
    // mt_financial_company: { financial: {}, financial_stp: {}, swap_free: {} }
    // mt_gaming_company: { financial: {}, swap_free: {} }
    const addAccount = (market_type, company = {}) => {
        // TODO: Update once market_types are available in inaccessible account details
        if (market_type === 'unknown' && !company) {
            const addUnknownAccount = (acc_type) => accounts_info[`${acc_type}_unknown`] = {
                is_demo              : acc_type === 'demo',
                landing_company_short: localize('Unavailable'),
                leverage             : localize('Unavailable'),
                market_type          : localize('Unavailable'),
                sub_account_type     : localize('Unavailable'),
                short_title          : localize('Unavailable'),
                title                : localize('Unavailable'),
            };
            addUnknownAccount('demo');
            addUnknownAccount('real');
        } else {
            Object.keys(company)
                .filter(sub_account_type => sub_account_type !== 'swap_free') // TODO: remove this when releasing swap_free
                .forEach((sub_account_type) => {
                    const landing_company_short = company[sub_account_type].shortcode;

                    ['demo', 'real'].forEach((account_type) => {
                        const is_demo = account_type === 'demo';
                        const display_name =
                            Client.getMT5AccountDisplays(market_type, sub_account_type, is_demo);
                        const leverage = getLeverage(market_type, sub_account_type, landing_company_short);

                        const addAccountsInfo = (trading_server) => {
                            // e.g. real_gaming_financial
                            let key = `${account_type}_${market_type}_${sub_account_type}`;

                            // e.g. real_gaming_financial_real01
                            if (trading_server) {
                                key += `_${trading_server.id}`;
                            }

                            accounts_info[key] = {
                                is_demo,
                                landing_company_short,
                                leverage,
                                market_type,
                                sub_account_type,
                                short_title: display_name.short,
                                title      : display_name.full,
                            };
                        };

                        addAccountsInfo();

                    });
                });
        }
    };

    // synthetic is 500
    // financial is 1000, unless maltainvest then 30
    // financial_stp is 100
    const getLeverage = (market_type, sub_account_type, landing_company_short) => {
        if (market_type === 'gaming') {
            return 500;
        }
        if (sub_account_type === 'financial') {
            return landing_company_short === 'maltainvest' ? 30 : 1000;
        }
        if (sub_account_type === 'financial_stp') {
            return 100;
        }
        return 0;
    };

    const getAllAccountsInfo = (response) => {
        DXTradeUI.init(submit, sendTopupDemo);
        show_new_account_popup = Client.canChangeCurrency(State.getResponse('statement'), (response.mt5_login_list || []), false);
        allAccountsResponseHandler(response);
    };

    const getDefaultAccount = () => {
        let default_account = '';
        if (DXTradeConfig.hasAccount(Client.get('mt5_account'))) {
            default_account = Client.get('mt5_account');

            if (/unknown+$/.test(default_account)) {
                const available_accounts = DXTradeConfig.getAllAccounts().filter(account => !/unknown+$/.test(account));
                if (available_accounts.length > 0) {
                    default_account = available_accounts[0];
                }
            }
        } else {
            default_account = DXTradeConfig.getAllAccounts()[0] || '';
        }
        return default_account;
    };

    const makeRequestObject = (acc_type, action) => {
        const req = {};

        Object.keys(fields[action]).forEach((field) => {
            const field_obj = fields[action][field];
            if (!field_obj.request_field) return;

            if (field_obj.is_radio) {
                req[field_obj.request_field] = DXTradeUI.$form().find(`input[name=${field_obj.id.slice(1)}]:checked`).val();
            } else {
                req[field_obj.request_field] = DXTradeUI.$form().find(field_obj.id).val();
            }
        });

        if (!/^(verify_password_reset)$/.test(action)) {
            // set main command
            req[`mt5_${action}`] = 1;
        }

        // add additional fields
        $.extend(req, fields[action].additional_fields(acc_type, DXTradeUI.getToken()));

        return req;
    };

    const submit = (e) => {
        e.preventDefault();

        if (show_new_account_popup) {
            DXTradeUI.showNewAccountConfirmationPopup(
                e,
                () => show_new_account_popup = false,
                () => show_new_account_popup = true
            );

            return;
        }

        const $btn_submit = $(e.target);
        const acc_type    = $btn_submit.attr('acc_type');
        const action      = $btn_submit.attr('action');
        DXTradeUI.hideFormMessage(action);
        if (Validation.validate(`#frm_${action}`)) {
            DXTradeUI.disableButton(action);
            // further validations before submit (password_check)
            DXTradeUI.postValidate(acc_type, action).then((is_ok) => {
                if (!is_ok) {
                    DXTradeUI.enableButton(action);
                    return;
                }

                if (action === 'verify_password_reset_token') {
                    DXTradeUI.setToken($('#txt_verification_code').val());
                    if (typeof actions_info[action].onSuccess === 'function') {
                        actions_info[action].onSuccess({}, DXTradeUI.$form());
                    }
                    return;
                }

                const req = makeRequestObject(acc_type, action);
                BinarySocket.send(req).then(async (response) => {
                    if (response.error) {
                        DXTradeUI.displayFormMessage(response.error.message, action);
                        if (typeof actions_info[action].onError === 'function') {
                            actions_info[action].onError(response, DXTradeUI.$form());
                        }
                        if (/^MT5(Deposit|Withdrawal)Error$/.test(response.error.code)) {
                            // update limits if outdated due to exchange rates changing for currency
                            BinarySocket.send({ website_status: 1 }).then((response_w) => {
                                if (response_w.website_status) {
                                    setCurrencies(response_w.website_status);
                                }
                            });
                        }
                        DXTradeUI.enableButton(action, response);
                    } else {
                        await BinarySocket.send({ get_account_status: 1 });
                        if (accounts_info[acc_type] && accounts_info[acc_type].info) {
                            const parent_action = /password/.test(action) ? 'manage_password' : 'cashier';
                            if (parent_action === 'cashier') {
                                await BinarySocket.send({ get_limits: 1 });
                            }
                            DXTradeUI.loadAction(parent_action);
                            DXTradeUI.enableButton(action, response);
                            DXTradeUI.refreshAction();
                        }
                        if (typeof actions_info[action].success_msg === 'function') {
                            const success_msg = actions_info[action].success_msg(response, acc_type);
                            if (actions_info[action].success_msg_selector) {
                                DXTradeUI.displayMessage(actions_info[action].success_msg_selector, success_msg, 1);
                            } else {
                                DXTradeUI.displayMainMessage(success_msg);
                            }
                            DXTradeUI.enableButton(action, response);
                        }
                        if (typeof actions_info[action].onSuccess === 'function') {
                            actions_info[action].onSuccess(response, DXTradeUI.$form());
                        }
                        BinarySocket.send({ mt5_login_list: 1 }).then((response_login_list) => {
                            DXTradeUI.refreshAction();
                            allAccountsResponseHandler(response_login_list);

                            const account_type = acc_type;

                            DXTradeUI.setAccountType(account_type, true);
                            DXTradeUI.loadAction(null, account_type);
                        });
                    }
                });
            });
        }
    };

    const allAccountsResponseHandler = (response) => {
        if (response.error) {
            DXTradeUI.displayPageError(response.error.message || localize('Sorry, an error occurred while processing your request.'));
            return;
        }

        const has_multi_mt5_accounts = (response.mt5_login_list.length > 1);
        const checkAccountTypeErrors = (type) => Object.values(response.mt5_login_list).filter(account => {
            if (account.error) {
                return account.error.details.account_type === type;
            }
            return null;
        });
        const has_demo_error = checkAccountTypeErrors('demo').length > 0;
        const has_real_error = checkAccountTypeErrors('real').length > 0;

        // Update account info
        response.mt5_login_list.forEach((account) => {
            let acc_type = `${account.account_type}_${account.market_type}_${account.sub_account_type}`;
            const acc_type_server = `${acc_type}_${account.server}`;
            if (!(acc_type in accounts_info) || acc_type_server in accounts_info) {
                acc_type = acc_type_server;
            }

            // in case trading_server API response is corrupted, acc_type will not exist in accounts_info due to missing supported_accounts prop
            if (acc_type in accounts_info && !/unknown+$/.test(acc_type)) {
                accounts_info[acc_type].info = account;

                accounts_info[acc_type].info.display_login = DXTradeConfig.getDisplayLogin(account.login);
                accounts_info[acc_type].info.login         = account.login;

                DXTradeUI.updateAccount(acc_type);
            } else if (account.error) {
                const { login, account_type } = account.error.details;

                // TODO: remove exception handlers for unknown_acc_type when details include market_types and sub market types
                const unknown_acc_type = account_type === 'real' ? 'real_unknown' : 'demo_unknown';
                accounts_info[unknown_acc_type].info = {
                    display_login: DXTradeConfig.getDisplayLogin(login),
                    login,
                };
                DXTradeUI.updateAccount(unknown_acc_type, false);

                if (!has_multi_mt5_accounts && (has_demo_error || has_real_error)) {
                    DXTradeUI.loadAction('new_account', null, true);
                } else if (has_real_error && has_demo_error) {
                    DXTradeUI.disableButtonLink('.act_new_account');
                }
            }
        });

        const current_acc_type = getDefaultAccount();
        Client.set('mt5_account', current_acc_type);

        // Update types with no account
        Object.keys(accounts_info)
            .filter(acc_type => !DXTradeConfig.hasAccount(acc_type))
            .forEach((acc_type) => { DXTradeUI.updateAccount(acc_type); });

        if (/unknown+$/.test(current_acc_type)) {
            DXTradeUI.updateAccount(current_acc_type);
            DXTradeUI.loadAction('new_account', null, true);
        }
    };

    const sendTopupDemo = () => {
        DXTradeUI.setTopupLoading(true);
        const acc_type = Client.get('mt5_account');
        const req      = {
            mt5_deposit: 1,
            to_mt5     : accounts_info[acc_type].info.login,
        };

        BinarySocket.send(req).then((response) => {
            if (response.error) {
                DXTradeUI.displayPageError(response.error.message);
                DXTradeUI.setTopupLoading(false);
            } else {
                DXTradeUI.displayMainMessage(
                    localize(
                        '[_1] has been credited into your MT5 Demo Account: [_2].',
                        [`10,000.00 ${DXTradeConfig.getCurrency(acc_type)}`, accounts_info[acc_type].info.display_login]
                    ));
                BinarySocket.send({ mt5_login_list: 1 }).then((res) => {
                    allAccountsResponseHandler(res);
                    DXTradeUI.setTopupLoading(false);
                });
            }
        });
    };

    const dxtradeMenuItemVisibility = () => {
        BinarySocket.wait('landing_company', 'get_account_status').then(async () => {
            if (isEligible()) {
                const dxtrade_visibility = document.getElementsByClassName('dxtrade_visibility');
                applyToAllElements(dxtrade_visibility, (el) => {
                    el.setVisibility(1);
                });
            }
        });
    };

    const onUnload = () => {
        DXTradeUI.refreshAction();
    };

    return {
        onLoad,
        onUnload,
        isEligible,
        dxtradeMenuItemVisibility,
    };
})();

module.exports = DXTrade;
