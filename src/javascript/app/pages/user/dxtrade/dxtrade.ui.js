const DXTradeConfig    = require('./dxtrade.config');
const Client           = require('../../../base/client');
const BinarySocket     = require('../../../base/socket');
const Dialog           = require('../../../common/attach_dom/dialog');
const Currency         = require('../../../common/currency');
const Validation       = require('../../../common/form_validation');
const getTransferFee   = require('../../../../_common/base/currency_base').getTransferFee;
const getElementById   = require('../../../../_common/common_functions').getElementById;
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const urlForStatic     = require('../../../../_common/url').urlForStatic;
const getHashValue     = require('../../../../_common/url').getHashValue;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const DXTradeUI = (() => {
    let $container,
        $list_cont,
        $dxtrade_account,
        $list,
        $detail,
        $action,
        $templates,
        $form,
        $main_msg,
        validations,
        submit,
        topup_demo,
        token,
        current_action_ui;

    const accounts_info = DXTradeConfig.accounts_info;
    const actions_info  = DXTradeConfig.actions_info;

    let disabled_signup_types = {
        'real': false,
        'demo': false,
    };

    const setDisabledAccountTypes = (disabled_types_obj) => {
        disabled_signup_types = { disabled_signup_types, ...disabled_types_obj };
    };

    const init = (submit_func, topup_demo_func) => {
        token            = getHashValue('token');
        topup_demo       = topup_demo_func;
        submit           = submit_func;
        $container       = $('#dxtrade_account_management');
        $dxtrade_account = $container.find('#dxtrade_account');
        $list_cont       = $container.find('#accounts_list');
        $list            = $list_cont.find('> div.list');
        $detail          = $container.find('#account_details');
        $action          = $container.find('#fst_action');
        $templates       = $container.find('#templates').remove();
        $main_msg        = $container.find('#main_msg');
        $container.find('[class*="act_"]').click(populateForm);

        DXTradeConfig.setMessages($templates.find('#messages'));

        validations = DXTradeConfig.validations();

        populateAccountTypes();
        populateAccountList();
    };

    const populateAccountList = () => {
        const $acc_name = $templates.find('> .acc-name');
        let acc_group_demo_set = false;
        let acc_group_real_set = false;
        Object.keys(accounts_info)
            .sort(sortMt5Accounts)
            .forEach((acc_type) => {
                if ($list.find(`[value="${acc_type}"]`).length === 0) {
                    if (accounts_info[acc_type].is_demo) {
                        if (!acc_group_demo_set) {
                            $list.append($('<div/>', { class: 'acc-group invisible', id: 'acc_group_demo', text: localize('Demo Accounts') }));
                            acc_group_demo_set = true;
                        }
                    } else if (!acc_group_real_set) {
                        $list.append($('<div/>', { class: 'acc-group invisible', id: 'acc_group_real', text: localize('Real-Money Accounts') }));
                        acc_group_real_set = true;
                    }
                    const $acc_item = $acc_name.clone();
                    $acc_item.attr('value', acc_type);
                    $list.append($acc_item);
                }
            });

        const hideList = () => {
            $list_cont.slideUp('fast', () => { $dxtrade_account.removeClass('open'); });
        };

        // account switch events
        $dxtrade_account.off('click').on('click', (e) => {
            e.stopPropagation();
            if ($list_cont.is(':hidden')) {
                $dxtrade_account.addClass('open');
                $list_cont.slideDown('fast');
            } else {
                hideList();
            }
        });
        $list.off('click').on('click', '.acc-name', function () {
            if (!$(this).hasClass('disabled')) {
                setAccountType($(this).attr('value'), true);
            }
        });
        $(document).off('click.dxtrade_account_list').on('click.dxtrade_account_list', () => {
            hideList();
        });
    };

    const setAccountType = (acc_type, should_set_account) => {
        if ($dxtrade_account.attr('value') !== acc_type) {
            Client.set('mt5_account', acc_type);
            $dxtrade_account.attr('value', acc_type).removeClass('empty');
            setMTAccountText();
            $list.find('.acc-name').removeClass('selected');
            $list.find(`[value="${acc_type}"]`).addClass('selected');
            $action.setVisibility(0);
            if (should_set_account) {
                setCurrentAccount(acc_type);
                $.scrollTo($('h1'), 300, { offset: -10 });
            }
        }
    };

    const updateAccount = (acc_type, should_set_account = true) => {
        updateListItem(acc_type);
        if (should_set_account) {
            setCurrentAccount(acc_type);
            showHideFinancialAuthenticate(acc_type);
        }
    };

    const setMTAccountText = () => {
        const acc_type = $dxtrade_account.attr('value');
        if (acc_type) {
            const sample_account = DXTradeConfig.getSampleAccount(acc_type);
            const display_login = getPropertyValue(sample_account, ['info', 'display_login']);
            const title = `${sample_account.title}${ display_login ? ` (${display_login})` : '' }`;
            if (!new RegExp(title).test($dxtrade_account.text())) {
                $dxtrade_account.html(title);
            }
        }
    };

    const disableButtonLink = (selector) => {
        const button_link_el = $container.find(selector);
        button_link_el.addClass('button-disabled');
        button_link_el.children('span').addClass('disabled');
    };

    const updateListItem = (acc_type) => {
        const $acc_item = $list.find(`[value="${acc_type}"]`);
        $acc_item.find('.dxtrade-type').text(accounts_info[acc_type].short_title);
        if (accounts_info[acc_type].info) {
            setMTAccountText();
            $acc_item.find('.dxtrade-login').text(`(${accounts_info[acc_type].info.display_login})`);
            if (
                DXTradeConfig.hasMultipleTradeServers(acc_type, accounts_info) ||
                /unknown+$/.test(acc_type)
            ) {
                // add disabled style to unknown or unavailable accounts
                if (/unknown+$/.test(acc_type)) {
                    $acc_item.find('.dxtrade-server').css({
                        'color'           : '#fff',
                        'background-color': '#dedede',
                    });
                }
            } else {
                $acc_item.find('.dxtrade-server').remove();
            }
            $acc_item.setVisibility(1);
            if (accounts_info[acc_type].is_demo) {
                $list.find('#acc_group_demo').setVisibility(1);
            } else {
                $list.find('#acc_group_real').setVisibility(1);
            }
            if (acc_type === Client.get('mt5_account')) {
                const mt_balance = Currency.formatMoney(DXTradeConfig.getCurrency(acc_type),
                    +accounts_info[acc_type].info.balance);
                $acc_item.find('.dxtrade-balance').html(mt_balance);
                $action.find('.mt5-balance').html(mt_balance);
            }
            // disable MT5 account opening if created all available accounts
            if (Object.keys(accounts_info).every(type => accounts_info[type].info)) {
                $container.find('.act_new_account').remove();
            }
        } else {
            $acc_item.setVisibility(0);
        }
        // TODO: Remove once market subtype and market types are provided by error details for inaccessible accounts
        if (acc_type.split('_')[1] === 'unknown') {
            $acc_item.addClass('disabled');
        }
    };

    const displayAccountDescription = (acc_type) => {
        const $account_desc = $templates.find('.account-desc');
        let $account_type_desc = '';
        if (acc_type) {
            $account_type_desc = $account_desc.find(`.${acc_type}`);

            const landing_company_short = DXTradeConfig.getSampleAccount(acc_type).landing_company_short;

            if ($account_type_desc.length === 2) {
                const $specific_description = $account_desc.find(`.${acc_type}.${landing_company_short}`);

                // try to find the landing_company specific description first,
                // otherwise fall back to the first item (the general description)
                $account_type_desc = $specific_description.length ? $specific_description : $account_type_desc.first();
            }
        }
        const $el_to_clone = $account_type_desc.length ? $account_type_desc : $account_desc.find('#general_desc');
        $container.find('#account_desc').html($el_to_clone.clone());
    };

    const setCurrentAccount = (acc_type) => {
        if (Client.get('mt5_account') && Client.get('mt5_account') !== acc_type) return;

        if (current_action_ui !== 'new_account') {
            displayAccountDescription(acc_type);
        }

        if (accounts_info[acc_type].info) {
            const is_demo = accounts_info[acc_type].is_demo;
            $detail.find('.real-only').setVisibility(!is_demo);
            // Update account info
            $detail.find('.acc-info div[data]').map(function () {
                const key     = $(this).attr('data');
                const info    = accounts_info[acc_type].info[key];
                const mapping = {
                    balance      : () => (isNaN(info) ? '' : Currency.formatMoney(DXTradeConfig.getCurrency(acc_type), +info)),
                    broker       : () => 'Deriv Limited',
                    display_login: () => (`${info} (${is_demo ? localize('Demo Account') : localize('Real-Money Account')})`),
                    leverage     : () => `1:${info}`,
                    server       : () => `Deriv-${is_demo ? 'Demo' : 'Server'}`,
                    ...(
                        accounts_info[acc_type].info.display_server &&
                        DXTradeConfig.hasMultipleTradeServers(acc_type, accounts_info) &&
                        ({ trade_server: () => accounts_info[acc_type].info.display_server })
                    ),
                };

                $(this).html(typeof mapping[key] === 'function' ? mapping[key]() : info);
            });

            setCounterpartyAndJurisdictionTooltip($('.acc-info div[data="display_login"]'), acc_type);

            // $container.find('.act_cashier').setVisibility(!types_info[acc_type].is_demo);
            if (current_action_ui !== 'new_account') {
                $container.find('.has-account').setVisibility(1);
            }
        } else {
            $detail.find('.acc-info, .acc-actions').setVisibility(0);
        }
        $('#dxtrade_loading').remove();
        $container.setVisibility(1);

        setAccountType(acc_type);

        if ($action.hasClass('invisible')) {
            loadAction(defaultAction(acc_type));
        }
    };

    const defaultAction = acc_type => {
        let type = 'new_account';
        if (accounts_info[acc_type].info) {
            type = (accounts_info[acc_type].is_demo || Client.get('is_virtual') || getHashValue('token')) ? 'manage_password' : 'cashier';
            removeUrlHash(); // only load manage_password section on first page load if token in url, after that remove it from url
        }
        return type;
    };

    const refreshAction = () => {
        current_action_ui = null;
    };

    const loadAction = (action, acc_type, should_hide_cancel) => {
        $container.find(`[class~=act_${action || defaultAction(acc_type)}]`).click();
        if (should_hide_cancel) {
            $form.find('#view_1 .btn-cancel').hide();
            $form.find('#view_2 .btn-cancel').hide();
        }
    };

    const populateForm = (e) => {
        let $target = $(e.target);

        if ($target.hasClass('button-disabled')) {
            return;
        }

        if ($target.prop('tagName').toLowerCase() !== 'a') {
            $target = $target.parents('a');
        }
        $main_msg.setVisibility(0);

        const acc_type = Client.get('mt5_account');
        const action   = $target.attr('class').split(' ').find(c => /^act_/.test(c)).replace('act_', '');

        const cloneForm = () => {
            $form = $templates.find(`#frm_${action}`).clone();
            $form.find(`.${/demo/.test(acc_type) ? 'demo' : 'real'}-only`).setVisibility(1);
            const formValues = (actions_info[action] || {}).formValues;
            if (formValues) formValues($form, acc_type, action);

            // append form
            $action.find('#frm_action').html($form).setVisibility(1).end()
                .setVisibility(1);

            if (action === 'manage_password') {
                $form.find('button[type="submit"]').append(accounts_info[acc_type].info.display_login ? ` ${localize('for account [_1]', accounts_info[acc_type].info.display_login)}` : '');
                if (!token) {
                    $form.find('#frm_verify_password_reset').setVisibility(1);
                } else if (!Validation.validEmailToken(token)) {
                    $form.find('#frm_verify_password_reset').find('#token_error').setVisibility(1).end().setVisibility(1);
                } else {
                    $form.find('#frm_password_reset').setVisibility(1);
                }
            }

            $form.find('button[type="submit"]').each(function() { // cashier has two different actions
                const this_action = $(this).attr('action');
                actions_info[this_action].$form = $(this).parents('form');
                $(this).attr({ acc_type }).on('click dblclick', submit);
                Validation.init(`#frm_${this_action}`, validations[this_action]);
            });

            handleNewAccountUI(action, acc_type, $target);
        };

        if (/new_account/.test(action)) {
            showFinancialAuthentication(false);
        }

        if (/manage_password|new_account/.test(action)) {
            cloneForm();
            return;
        }

        if (action === 'cashier') { // Manage Fund
            const client_currency = Client.get('currency');
            const mt_currency     = DXTradeConfig.getCurrency(acc_type);
            cloneForm();
            setDemoTopupStatus();
            $form.find('.binary-account').text(`${localize('[_1] Account [_2]', ['Binary', Client.get('loginid')])}`);
            $form.find('.binary-balance').html(`${Currency.formatMoney(client_currency, Client.get('balance'))}`);
            $form.find('.mt5-account').text(`${localize('[_1] Account [_2]', [accounts_info[acc_type].title, accounts_info[acc_type].info.display_login])}`);
            $form.find('.mt5-balance').html(`${Currency.formatMoney(mt_currency, accounts_info[acc_type].info.balance)}`);
            $form.find('label[for="txt_amount_deposit"]').append(` ${Currency.getCurrencyDisplayCode(client_currency)}`);
            $form.find('label[for="txt_amount_withdrawal"]').append(` ${mt_currency}`);

            const should_show_transfer_fee = client_currency !== mt_currency;
            if (should_show_transfer_fee) {
                $('#transfer_fee_amount_to').text(getTransferFee(client_currency, mt_currency));
                $('#transfer_fee_minimum_to').text(Currency.getMinimumTransferFee(client_currency));
                $('#transfer_fee_amount_from').text(getTransferFee(mt_currency, client_currency));
                $('#transfer_fee_minimum_from').text(Currency.getMinimumTransferFee(mt_currency));
            }
            $form.find('#txt_amount_deposit, #txt_amount_withdrawal').siblings('.hint').setVisibility(should_show_transfer_fee);

            ['deposit', 'withdrawal'].forEach((act) => {
                actions_info[act].prerequisites(acc_type).then((error_msg) => {
                    if (error_msg) {
                        $container.find(`#frm_${act} .form`).replaceWith($('<p/>', { class: 'unavailable' }));
                        displayMessage(`#frm_${act} .unavailable`, error_msg, true);
                    }
                });
            });

            if (!accounts_info[acc_type].is_demo) {
                let msg = '';
                if (Client.get('is_virtual')) {
                    msg = DXTradeConfig.needsRealMessage();
                } else if (!Client.get('currency')) { // client should set currency before accessing fund management section
                    msg = $templates.find('#msg_set_currency').html();
                }
                if (msg) {
                    displayMainMessage(msg, false);
                    $action.find('#frm_cashier').setVisibility(0);
                }
            }

            const remaining_transfers = getPropertyValue(State.getResponse('get_limits'), ['daily_transfers', 'mt5', 'available']);

            if (typeof remaining_transfers !== 'undefined') {
                const $remaining_container = $form.find('#mt5_remaining_transfers');
                $remaining_container.setVisibility(1);
                const $remaining_number = $remaining_container.find('strong');
                $remaining_number.text(remaining_transfers);
                if (+remaining_transfers) {
                    $remaining_number.removeClass('empty');
                } else {
                    $remaining_number.addClass('empty');
                }
            }

            return;
        }

        actions_info[action].prerequisites(acc_type).then((error_msg) => {
            if (error_msg) { // does not meet one of prerequisites
                displayMainMessage(error_msg);
                $action.find('#frm_action').empty().end().setVisibility(1);
                $container.find('[class*="act_"]').removeClass('selected');
                $container.find(`[class~=act_${action}]`).addClass('selected');
                return;
            }

            if (!$action.find(`#frm_${action}`).length) {
                $main_msg.setVisibility(0);
            }

            cloneForm();
        });
    };

    const displayStep = (step) => {
        const new_account_type = newAccountGetType();

        $form.find('#btn_submit_new_account').setVisibility(0).attr('disabled', true);
        $form.find('#msg_form').remove();
        $form.find('#mv_new_account div[id^="view_"]').setVisibility(0);
        $form.find(`#view_${step}`).setVisibility(1);
        $form.find('#view_2').find('.error-msg, .days_to_crack').setVisibility(0);
        $form.find(`.${/demo/.test(new_account_type) ? 'real' : 'demo'}-only`).setVisibility(0);

        if (step === 2) {
            $form.find('input').not(':input[type=radio]').val('');

            const get_settings = State.getResponse('get_settings');

            if (get_settings.first_name && get_settings.last_name) {
                $form.find('#txt_name').val(`${get_settings.first_name} ${get_settings.last_name}`);
            }

            const $view_2_button_container = $form.find('#view_2-buttons');

            const $submit_button = $form.find('#btn_submit_new_account');

            $('<p />', { id: 'msg_form', class: 'center-text gr-padding-10 error-msg no-margin invisible' }).prependTo($view_2_button_container);

            // If we have no trading servers, skip the step after this
            // by showing the "Create account" button right away.
            $form.find('#view_2 .btn-next').setVisibility(0);
            $view_2_button_container.append($submit_button);
            $submit_button.setVisibility(1);
            $submit_button.removeAttr('disabled');

            $view_2_button_container.setVisibility(1);
        }
    };

    // -----------------------
    // ----- New Account -----
    // -----------------------
    const handleNewAccountUI = (action, acc_type, $target) => {
        current_action_ui = action;

        const is_new_account = /new_account/.test(action);
        const $acc_actions = $container.find('.acc-actions');
        $acc_actions.find('.new-account').setVisibility(is_new_account);
        $acc_actions.find('.has-account').setVisibility(!is_new_account);
        $detail.setVisibility(!is_new_account);

        $container.find('[class*="act_"]').removeClass('selected');
        // set active tab
        if (is_new_account) {
            $container.find(`[class~=act_${action}]`).addClass('selected');
        } else {
            $detail.setVisibility(1);
            $target.addClass('selected');
            return;
        }

        // is_new_account
        displayAccountDescription();
        $form = actions_info[action].$form;
        if (Object.keys(accounts_info).every(a_type => !accounts_info[a_type].info)) {
            $form.find('#view_1 .btn-cancel').addClass('invisible');
        }

        // Navigation buttons: cancel, next, back
        $form.find('.btn-cancel').click(() => {
            loadAction(null, acc_type);
            displayAccountDescription(accounts_info[acc_type].info ? acc_type : undefined);
            $.scrollTo($('h1'), 300, { offset: -10 });
            showFinancialAuthentication(true);
        });

        $form.find('#view_1 .btn-next').click(function() {
            if (!$(this).hasClass('button-disabled')) {
                displayStep(2);
                $form.find('button[type="submit"]').attr('acc_type', newAccountGetType());
                $.scrollTo($container.find('.acc-actions'), 300, { offset: -10 });
            }
        });

        $form.find('#view_2 .btn-next').click(() => {
            if (Validation.validate('#frm_new_account')) {
                const new_account_type = newAccountGetType();
                $form.find('button[type="submit"]').attr('acc_type', new_account_type);
                displayStep(3);
                $.scrollTo($container.find('.acc-actions'), 300, { offset: -10 });
            }
        });

        $form.find('#view_2 .btn-back').click(() => { displayStep(1); });
        $form.find('#view_3 .btn-back').click(() => { displayStep(2); });

        // Account type selection
        $form.find('.dxtrade_type_box').click(selectAccountTypeUI);

        // disable signups by types that have errors
        if (disabled_signup_types.demo) {
            $('#rbtn_demo').addClass('disabled').next('p').css('color', '#DEDEDE');
        } else if (disabled_signup_types.real) {
            $('#rbtn_real').addClass('disabled').next('p').css('color', '#DEDEDE');
        }
    };

    const newAccountGetType = () => {
        const selected_type = $form && $form.find('.step-2 .selected').attr('data-acc-type');
        // if user selected account type using the form, send that
        if (selected_type) {
            return `${$form.find('.step-1 .selected').attr('data-acc-type') || 'real'}_${$form.find('.step-2 .selected').attr('data-acc-type')}`;
        }
        // otherwise they are adding more server to their current account type
        const saved_mt5_account = Client.get('mt5_account');
        return DXTradeConfig.getCleanAccType(saved_mt5_account);
    };

    const selectAccountTypeUI = (e) => {
        const box_class = 'dxtrade_type_box';
        let $item = $(e.target);
        if (!$item.hasClass(box_class)) {
            $item = $item.parents(`.${box_class}`);
        }
        if (/\b(disabled|selected|existed)\b/.test($item.attr('class'))) return;
        $item.parents('.type-group').find(`.${box_class}.selected`).removeClass('selected');
        $item.addClass('selected');
        const selected_acc_type = $item.attr('data-acc-type');
        const action            = 'new_account';
        if (/(demo|real)/.test(selected_acc_type)) {
            displayAccountDescription();
            updateAccountTypesUI(selected_acc_type);
            switchAccountTypesUI(selected_acc_type, $form);
            $form.find('#view_1 .btn-next').addClass('button-disabled');
            $form.find('#view_1 .step-2').setVisibility(1);
            displayMessage('#new_account_msg', (selected_acc_type === 'real' && Client.get('is_virtual')) ? DXTradeConfig.needsRealMessage() : '', true);
        } else {
            const new_acc_type = newAccountGetType();
            displayAccountDescription(new_acc_type);
            actions_info[action].prerequisites(new_acc_type).then((error_msg) => {
                displayMessage('#new_account_msg', error_msg || '');
                $form.find('#view_1 .btn-next')[error_msg ? 'addClass' : 'removeClass']('button-disabled');
                $form.find('#view_1 .btn-cancel').removeClass('invisible');
            });
        }
    };

    const switchAccountTypesUI = (type, form) => {
        const demo_btn = form.find('#view_1 .step-2 .type-group .template_demo');
        const real_btn = form.find('#view_1 .step-2 .type-group .template_real');

        if (/demo/.test(type)) {
            demo_btn.removeClass('invisible');
            real_btn.addClass('invisible');
        } else {
            demo_btn.addClass('invisible');
            real_btn.removeClass('invisible');
        }
    };

    const sortMt5Accounts = (a, b) => {
        if (/demo/.test(a) && !/demo/.test(b)) {
            return -1;
        }
        if (/demo/.test(b) && !/demo/.test(a)) {
            return 1;
        }
        if (/svg$/.test(a)) {
            return -1;
        }
        if (/vanuatu|svg_standard/.test(a)) {
            return /svg$/.test(b) ? 1 : -1;
        }
        return 1;
    };

    const updateAccountTypesUI = (type) => {
        Object.keys(accounts_info)
            .filter(acc_type => acc_type.indexOf(type) === 0)
            .forEach((acc_type) => {
                let class_name = (type === 'real' && Client.get('is_virtual')) ? 'disabled' : '';
                if (accounts_info[acc_type].info && type === 'demo') {
                    class_name = 'existed';
                }
                const clean_acc_type = DXTradeConfig.getCleanAccType(acc_type);
                $form.find(`.step-2 #${clean_acc_type.replace(type, 'rbtn')}`)
                    .removeClass('existed disabled selected')
                    .addClass(class_name);
            });
    };

    const populateAccountTypes = () => {
        const $acc_template_demo = $($templates.find('#rbtn_template_demo').parent().remove()[0]);
        const $acc_template_real = $($templates.find('#rbtn_template_real').parent().remove()[0]);
        const $acc_template_mt   = $templates.find('#frm_new_account #view_1 .step-2 .type-group');
        if (!$acc_template_demo.length
            || !$acc_template_real.length
            || !$acc_template_mt.length) return;

        let count = 0;
        const filtered_accounts = {};
        Object.keys(accounts_info).sort(sortMt5Accounts).forEach(acc_type => {
            // remove server from name
            const clean_acc_type = DXTradeConfig.getCleanAccType(acc_type);
            filtered_accounts[clean_acc_type] = accounts_info[acc_type];
        });

        Object.keys(filtered_accounts).forEach((acc_type) => {
            // TODO: remove once we have market type and sub type data from error response details
            if (/unknown+$/.test(acc_type)) return;
            const $acc  = filtered_accounts[acc_type].is_demo ? $acc_template_demo.clone() : $acc_template_real.clone();
            const type  = acc_type.split('_').slice(1).join('_');
            const image = filtered_accounts[acc_type].market_type === 'gaming' ? 'synthetic' : filtered_accounts[acc_type].sub_account_type; // image name can be (financial|synthetic)
            $acc.find('.dxtrade_type_box').attr({ id: `rbtn_${type}`, 'data-acc-type': type })
                .find('img').attr('src', urlForStatic(`/images/pages/dxtrade/icons/acc_${image}.svg`));
            $acc.find('p').text(filtered_accounts[acc_type].short_title);
            $acc_template_mt.append($acc);

            count++;
        });
        $templates.find('.hl-types-of-accounts').setVisibility(count > 1);
    };

    // -------------------
    // ----- General -----
    // -------------------
    const postValidate = (acc_type, action) => {
        const validate = actions_info[action].pre_submit;
        return validate ? validate(actions_info[action].$form, acc_type, displayFormMessage) :
            new Promise(resolve => resolve(true));
    };

    const removeUrlHash = () => {
        const url = location.href.split('#')[0];
        window.history.replaceState({ url }, document.title, url);
    };

    const hideFormMessage = (action) => {
        actions_info[action].$form.find('#msg_form').html('').setVisibility(0);
    };

    const displayFormMessage = (message, action) => {
        actions_info[action].$form.find('#msg_form').html(message).setVisibility(1);
    };

    const displayMainMessage = (message, should_scroll = true) => {
        $main_msg.html(message).setVisibility(1);
        if (should_scroll) {
            $.scrollTo($action, 500, { offset: -80 });
        }
    };

    const displayMessage = (selector, message, is_centered) => {
        $container.find(selector).html(message).attr('class', `notice-msg hint ${is_centered ? 'center-text' : 'align-start'}`).setVisibility(message.length);
    };

    const displayPageError = (message) => {
        $('#page_msg').html(message).setVisibility(1);
        $('#dxtrade_loading').remove();
    };

    const disableButton = (action) => {
        const $btn = actions_info[action].$form.find('button');
        if ($btn.length && !$btn.find('.barspinner').length) {
            $btn.attr('disabled', 'disabled');
            const $btn_text = $('<span/>', { text: $btn.text(), class: 'invisible' });
            showLoadingImage($btn[0], 'white');
            $btn.append($btn_text);
        }
    };

    const enableButton = (action, response = {}) => {
        const $btn = actions_info[action].$form.find('button');
        if ($btn.length && $btn.find('.barspinner').length) {
            $btn.removeAttr('disabled').html($btn.find('span').text());
        }
        if (/password_reset/.test(action)) {
            // after submit is done, reset token value
            resetManagePasswordTab(action, response);
        }
    };

    const resetManagePasswordTab = (action, response) => {
        const has_invalid_token = getPropertyValue(response, ['error', 'code']) === 'InvalidToken';
        if (!response.error || has_invalid_token) {
            token = '';
            if (action === 'password_reset') { // go back to verify reset password form
                loadAction('manage_password');
                if (!response.error) {
                    displayMainMessage(localize('The [_1] password of account number [_2] has been changed.', [response.echo_req.password_type, DXTradeConfig.getDisplayLogin(response.echo_req.login)]));
                } else if (has_invalid_token) {
                    $form.find('#frm_verify_password_reset #token_error').setVisibility(1);
                }
            }
        }
    };

    const showHideFinancialAuthenticate = (acc_type) => {
        if (DXTradeConfig.hasAccount(acc_type)) {
            $('#financial_authenticate_msg').setVisibility(DXTradeConfig.isAuthenticationPromptNeeded());
        }
    };

    const showFinancialAuthentication = (should_show) => {
        $('#financial_authenticate_msg').setVisibility(should_show ? DXTradeConfig.isAuthenticationPromptNeeded() : 0);
    };

    const setCounterpartyAndJurisdictionTooltip = ($el, acc_type) => {
        // TODO: Remove once we have market type and sub type in error details
        if (/unknown+$/.test(acc_type)) {
            return;
        }

        const $icon = $el.parent().find('.display_login_tip');
        const is_mobile = window.innerWidth < 770;
        /*
            The details for vanuatu landing company was changed to
            those of the svg landing company, thus it will show
            the new details instead of the old one even when the
            account is still on the old landing company.

            The code below is to stop the tooltip from showing wrong
            information.
        */
        if ((accounts_info[acc_type].landing_company_short === 'vanuatu' &&
            accounts_info[acc_type].market_type === 'financial' &&
            accounts_info[acc_type].sub_account_type === 'financial') ||
            is_mobile) {
            $icon.remove();
            return;
        }

        BinarySocket.wait('landing_company').then((response) => {
            const company = response.landing_company[`mt_${accounts_info[acc_type].market_type}_company`][accounts_info[acc_type].sub_account_type];

            $icon.attr({
                'data-balloon'       : `${localize('Counterparty')}: ${company.name}, ${localize('Jurisdiction')}: ${company.country}`,
                'data-balloon-length': 'large',
            });
        });
    };

    const setDemoTopupStatus = () => {
        const el_demo_topup_btn  = getElementById('demo_topup_btn');
        const el_loading         = getElementById('demo_topup_loading');
        const acc_type           = Client.get('mt5_account');
        const is_demo            = accounts_info[acc_type].is_demo;
        const topup_btn_text     = localize('Get [_1]', `10,000.00 ${DXTradeConfig.getCurrency(acc_type)}`);

        el_loading.setVisibility(0);
        el_demo_topup_btn.firstChild.innerText = topup_btn_text;

        if (is_demo) {
            const balance     = +accounts_info[acc_type].info.balance;
            const min_balance = 1000;

            if (balance <= min_balance) {
                enableDemoTopup(true, acc_type);
            } else {
                enableDemoTopup(false, acc_type);
            }
        }
    };

    const enableDemoTopup = (is_enabled, acc_type) => {
        const el_demo_topup_btn = getElementById('demo_topup_btn');
        const el_demo_topup_info = getElementById('demo_topup_info');

        const function_to_call = is_enabled ? 'addEventListener' : 'removeEventListener';
        el_demo_topup_btn[function_to_call]('click', topup_demo);

        el_demo_topup_btn.classList.add(is_enabled ? 'button' : 'button-disabled');
        el_demo_topup_btn.classList.remove(is_enabled ? 'button-disabled' : 'button');

        el_demo_topup_info.innerText = is_enabled
            ? localize('Your demo account balance is currently [_1] or less. You may top up your account with an additional [_2].', [`1,000.00 ${DXTradeConfig.getCurrency(acc_type)}`, `10,000.00 ${DXTradeConfig.getCurrency(acc_type)}`])
            : localize('You can top up your demo account with an additional [_1] if your balance is [_2] or less.', [`10,000.00 ${DXTradeConfig.getCurrency(acc_type)}`, `1,000.00 ${DXTradeConfig.getCurrency(acc_type)}`]);
    };

    const setTopupLoading = (is_loading) => {
        const el_demo_topup_btn  = getElementById('demo_topup_btn');
        const el_demo_topup_info = getElementById('demo_topup_info');
        const el_loading         = getElementById('demo_topup_loading');

        el_demo_topup_btn.setVisibility(!is_loading);
        el_demo_topup_info.setVisibility(!is_loading);
        el_loading.setVisibility(is_loading);

        if (!is_loading) {
            setDemoTopupStatus();
        }
    };

    const showNewAccountConfirmationPopup = (e, onConfirm, onAbort) => {

        Dialog.confirm({
            id               : 'create_dxtrade_popup_container',
            ok_text          : localize('Yes, I\'m sure'),
            cancel_text      : localize('Cancel'),
            localized_title  : localize('Are you sure?'),
            localized_message: localize('You will not be able to change your fiat account\'s currency after creating this DXTrade account. Are you sure you want to proceed?'),
            onConfirm        : () => {
                onConfirm();
                submit(e);
            },
            onAbort,
        });
    };

    return {
        init,
        setAccountType,
        setDisabledAccountTypes,
        loadAction,
        updateAccount,
        postValidate,
        hideFormMessage,
        displayFormMessage,
        displayMainMessage,
        displayMessage,
        displayPageError,
        disableButton,
        disableButtonLink,
        enableButton,
        refreshAction,
        setTopupLoading,
        showNewAccountConfirmationPopup,

        $form                  : () => $form,
        getDisabledAccountTypes: () => disabled_signup_types,
        getToken               : () => token,
        setToken               : (verification_code) => { token = verification_code; },
    };
})();

module.exports = DXTradeUI;
