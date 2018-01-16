const moment           = require('moment');
const BinaryPjax       = require('../../../../base/binary_pjax');
const Client           = require('../../../../base/client');
const Header           = require('../../../../base/header');
const BinarySocket     = require('../../../../base/socket');
const formatMoney      = require('../../../../common/currency').formatMoney;
const FormManager      = require('../../../../common/form_manager');
const CommonFunctions  = require('../../../../../_common/common_functions');
const localize         = require('../../../../../_common/localize').localize;
const State            = require('../../../../../_common/storage').State;
require('select2');

const PersonalDetails = (() => {
    const form_id           = '#frmPersonalDetails';
    const real_acc_elements = '.RealAcc';

    let is_for_new_account = false;

    let editable_fields,
        is_jp,
        is_virtual,
        residence,
        get_settings_data,
        currency;

    const init = () => {
        editable_fields   = {};
        get_settings_data = {};
        is_virtual        = Client.get('is_virtual');
        residence         = Client.get('residence');
        is_jp             = residence === 'jp';
        if (is_jp && !is_virtual) {
            setVisibility('#fieldset_email_consent');
        }
        showHideTaxMessage();
    };

    const showHideTaxMessage = () => {
        if (Client.shouldCompleteTax()) {
            setVisibility('#tax_information_notice');
        } else {
            $('#tax_information_notice').setVisibility(0);
        }
    };

    const getDetailsResponse = (data) => {
        const get_settings         = $.extend({}, data);
        get_settings.date_of_birth = get_settings.date_of_birth ? moment.utc(new Date(get_settings.date_of_birth * 1000)).format('YYYY-MM-DD') : '';
        const accounts             = Client.getAllLoginids();
        // for subaccounts, back-end sends loginid of the master account as name
        const hide_name            = accounts.some(loginid => new RegExp(loginid, 'i').test(get_settings.first_name)) || is_virtual;
        if (!hide_name) {
            setVisibility('#row_name');
            get_settings.name = is_jp ? get_settings.last_name : `${(get_settings.salutation || '')} ${(get_settings.first_name || '')} ${(get_settings.last_name || '')}`;
        }

        if (Object.prototype.hasOwnProperty.call(get_settings, 'account_opening_reason') && !is_jp) {
            if (get_settings.account_opening_reason) {
                // we have to show text here instead of relying on displayGetSettingsData() since it prioritizes
                // showing data in account_opening_reason instead of lbl_account_opening_reason
                $('#lbl_account_opening_reason').text(get_settings.account_opening_reason);
                $('#row_account_opening_reason').setVisibility(0);
                $('#row_lbl_account_opening_reason').setVisibility(1);
            } else {
                $('#row_lbl_account_opening_reason').setVisibility(0);
                $('#row_account_opening_reason').setVisibility(1);
            }
        }

        displayGetSettingsData(get_settings);

        if (is_virtual) {
            $(real_acc_elements).remove();
        } else if (is_jp) {
            const jp_settings = get_settings.jp_settings;
            switch (jp_settings.gender) {
                case 'f':
                    jp_settings.gender = localize('Female');
                    break;
                case 'm':
                    jp_settings.gender = localize('Male');
                    break;
                default:
                    break;
            }
            displayGetSettingsData(jp_settings);
            if (jp_settings.hedge_asset !== null && jp_settings.hedge_asset_amount !== null) {
                setVisibility('.hedge');
            }
            setVisibility('.JpAcc');
        } else {
            setVisibility(real_acc_elements);
        }
        setVisibility('#row_country');
        setVisibility('#row_email');
        $(form_id).setVisibility(1);
        FormManager.handleSubmit({
            form_selector       : form_id,
            obj_request         : { set_settings: 1 },
            fnc_response_handler: setDetailsResponse,
            fnc_additional_check: additionalCheck,
            enable_button       : true,
        });
    };

    const displayGetSettingsData = (data, populate = true) => {
        let el_key,
            el_lbl_key,
            data_key;
        Object.keys(data).forEach((key) => {
            el_key     = document.getElementById(key);
            el_lbl_key = document.getElementById(`lbl_${key}`);
            // prioritise labels for japan account
            el_key     = is_jp ? (el_lbl_key || el_key) : (el_key || el_lbl_key);
            if (el_key) {
                data_key             = /format_money/.test(el_key.className) && data[key] !== null ? formatMoney(currency, data[key]) : (data[key] || '');
                editable_fields[key] = data_key;
                if (populate) {
                    if (el_key.type === 'checkbox') {
                        el_key.checked = !!data_key;
                    } else if (/select|text/i.test(el_key.type)) {
                        $(el_key)
                            .val(data_key.split(','))
                            .trigger('change');
                    } else if (key !== 'country') {
                        CommonFunctions.elementInnerHtml(el_key, data_key ? localize(data_key) : '-');
                    }
                }
            }
        });
        if (data.country) {
            $('#residence').replaceWith($('<label/>').append($('<strong/>', { id: 'lbl_country' })));
            $('#lbl_country').text(data.country);
            if (is_virtual) $('#btn_update').setVisibility(0);
        }
    };

    const additionalCheck = (data) => {
        if (!isChanged(data) && (!data.jp_settings || !isChanged(data.jp_settings))) {
            showFormMessage('You did not change anything.', false);
            return false;
        }
        return true;
    };

    const isChanged = (data) => {
        const compare_data = $.extend({}, data);
        return Object.keys(compare_data).some(key => (
            key !== 'set_settings' && key !== 'jp_settings' && editable_fields[key] !== compare_data[key]
        ));
    };

    const getValidations = (data) => {
        let validations;
        if (is_jp) {
            validations = [
                { request_field: 'address_line_1',   value: data.address_line_1 },
                { request_field: 'address_line_2',   value: data.address_line_2 },
                { request_field: 'address_city',     value: data.address_city },
                { request_field: 'address_state',    value: data.address_state },
                { request_field: 'address_postcode', value: data.address_postcode },
                { request_field: 'phone',            value: data.phone },

                { selector: '#email_consent' },

                { selector: '#hedge_asset_amount',     validations: ['req', 'number'], parent_node: 'jp_settings' },
                { selector: '#hedge_asset',            validations: ['req'],           parent_node: 'jp_settings' },
                { selector: '#account_opening_reason', validations: ['req'] },

            ];
            $(form_id).find('select').each(function () {
                validations.push({ selector: `#${$(this).attr('id')}`, validations: ['req'], parent_node: 'jp_settings' });
            });
        } else if (is_virtual) {
            validations = [{ selector: '#residence', validations: ['req'] }];
        } else {
            validations = [
                { selector: '#address_line_1',         validations: ['req', 'address'] },
                { selector: '#address_line_2',         validations: ['address'] },
                { selector: '#address_city',           validations: ['req', 'letter_symbol'] },
                { selector: '#address_state',          validations: $('#address_state').prop('nodeName') === 'SELECT' ? '' : ['letter_symbol'] },
                { selector: '#address_postcode',       validations: [Client.get('residence') === 'gb' ? 'req' : '', 'postcode', ['length', { min: 0, max: 20 }]] },
                { selector: '#phone',                  validations: ['req', 'phone', ['length', { min: 6, max: 35, value: () => $('#phone').val().replace(/^\+/, '')  }]] },
                { selector: '#account_opening_reason', validations: ['req'] },

                { selector: '#place_of_birth', validations: Client.isAccountOfType('financial') ? ['req'] : '' },
                { selector: '#tax_residence',  validations: Client.isAccountOfType('financial') ? ['req'] : '' },
            ];
            const tax_id_validation = { selector: '#tax_identification_number', validations: ['tax_id', ['length', { min: 0, max: 20 }]] };
            if (Client.isAccountOfType('financial')) {
                tax_id_validation.validations[1][1].min = 1;
                tax_id_validation.validations.unshift('req');
            }
            validations.push(tax_id_validation);
        }
        return validations;
    };

    const setDetailsResponse = (response) => {
        // allow user to resubmit the form on error.
        const is_error = response.set_settings !== 1;
        if (!is_error) {
            // to update tax information message for financial clients
            BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(() => {
                showHideTaxMessage();
                Header.displayAccountStatus();
            });
            // to update the State with latest get_settings data
            BinarySocket.send({ get_settings: 1 }, { forced: true }).then((data) => {
                getDetailsResponse(data.get_settings);
                // update notification shown for set residence etc
                Header.displayAccountStatus();
                if (is_for_new_account) {
                    is_for_new_account = false;
                    BinaryPjax.loadPreviousUrl();
                }
            });
        }
        showFormMessage(is_error ?
            'Sorry, an error occurred while processing your account.' :
            'Your settings have been updated successfully.', !is_error);
    };

    const showFormMessage = (msg, is_success) => {
        $('#formMessage')
            .attr('class', is_success ? 'success-msg' : 'errorfield')
            .html(is_success ? $('<ul/>', { class: 'checked' }).append($('<li/>', { text: localize(msg) })) : localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    const populateResidence = (response) => {
        const residence_list  = response.residence_list;
        const $place_of_birth = $('#place_of_birth');
        const $tax_residence  = $('#tax_residence');
        if (residence_list.length > 0) {
            const $options               = $('<div/>');
            const $options_with_disabled = $('<div/>');
            residence_list.forEach((res) => {
                $options.append(CommonFunctions.makeOption({ text: res.text, value: res.value }));
                $options_with_disabled.append(CommonFunctions.makeOption({
                    text       : res.text,
                    value      : res.value,
                    is_disabled: res.disabled,
                }));
            });

            if (residence) {
                const tax_residence = get_settings_data.tax_residence;
                $place_of_birth.html($options.html());
                $tax_residence.html($options.html()).promise().done(() => {
                    setTimeout(() => {
                        $tax_residence.select2()
                            .val(tax_residence ? tax_residence.split(',') : '').trigger('change');
                        setVisibility('#tax_residence');
                    }, 500);
                });
                $place_of_birth.val(get_settings_data.place_of_birth || residence);
            } else {
                $('#lbl_country').parent().replaceWith($('<select/>', { id: 'residence' }));
                const $residence = $('#residence');
                $options_with_disabled.prepend($('<option/>', { text: localize('Please select a value'), value: '' }));
                $residence.html($options_with_disabled.html());
                initFormManager();
            }
        }
    };

    const populateStates = (response) => {
        const states = response.states_list;

        if (is_jp) {
            const state_text = (states.filter(state => state.value === get_settings_data.address_state)[0] || {}).text;
            $('#lbl_address_state').text(state_text || get_settings_data.address_state);
        } else {
            const address_state = '#address_state';
            let $field          = $(address_state);

            $field.empty();

            if (states && states.length > 0) {
                $field.append($('<option/>', { value: '', text: localize('Please select') }));
                states.forEach((state) => {
                    $field.append($('<option/>', { value: state.value, text: state.text }));
                });
            } else {
                $field.replaceWith($('<input/>', { id: address_state.replace('#', ''), name: 'address_state', type: 'text', maxlength: '35' }));
                $field = $(address_state);
            }
            $field.val(get_settings_data.address_state);
        }

        initFormManager();
        if (is_jp && !is_virtual) {
            // detect hedging needs to be called after FormManager.init
            // or all previously bound event listeners on form elements will be removed
            CommonFunctions.detectHedging($('#trading_purpose'), $('.hedge'));
        }
    };

    const initFormManager = () => { FormManager.init(form_id, getValidations(get_settings_data)); };

    const setVisibility = (el) => {
        if (is_for_new_account) {
            $(el).setVisibility(0);
        } else {
            $(el).setVisibility(1);
        }
    };

    const onLoad = () => {
        currency = Client.get('currency');
        BinarySocket.wait('get_account_status', 'get_settings').then(() => {
            init();
            get_settings_data = State.getResponse('get_settings');
            getDetailsResponse(get_settings_data);

            $('#account_opening_reason_notice').setVisibility(+is_for_new_account);

            if (!is_virtual || !residence) {
                $('#btn_update').setVisibility(1);
                if (!is_jp) {
                    BinarySocket.send({ residence_list: 1 }).then(response => populateResidence(response));
                }
                if (residence) {
                    BinarySocket.send({ states_list: residence }).then(response => populateStates(response));
                }
            } else {
                $('#btn_update').setVisibility(0);
            }
        });
    };

    return {
        onLoad,

        setIsForNewAccount: (bool) => { is_for_new_account = bool; },
    };
})();

module.exports = PersonalDetails;
