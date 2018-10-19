const SelectMatcher      = require('@binary-com/binary-style').select2Matcher;
const Cookies            = require('js-cookie');
const generateBirthDate  = require('./attach_dom/birth_date_picker');
const FormManager        = require('./form_manager');
const BinaryPjax         = require('../base/binary_pjax');
const Client             = require('../base/client');
const BinarySocket       = require('../base/socket');
const professionalClient = require('../pages/user/account/settings/professional_client');
const CommonFunctions    = require('../../_common/common_functions');
const Geocoder           = require('../../_common/geocoder');
const localize           = require('../../_common/localize').localize;
const State              = require('../../_common/storage').State;
const urlFor             = require('../../_common/url').urlFor;
const getPropertyValue   = require('../../_common/utility').getPropertyValue;

const AccountOpening = (() => {
    const redirectAccount = () => {
        const upgrade_info = Client.getUpgradeInfo();

        if (!upgrade_info.can_upgrade) {
            BinaryPjax.loadPreviousUrl();
            return -1;
        }

        if (!upgrade_info.is_current_path) {
            BinaryPjax.load(upgrade_info.upgrade_link);
            return 1;
        }
        return 0;
    };

    const populateForm = (form_id, getValidations, is_financial) => {
        getResidence(form_id, getValidations);
        generateBirthDate();
        const landing_company  = State.getResponse('landing_company');
        const lc_to_upgrade_to = landing_company[is_financial ? 'financial_company' : 'gaming_company'] || landing_company.financial_company;
        CommonFunctions.elementTextContent(CommonFunctions.getElementById('lc-name'), lc_to_upgrade_to.name);
        CommonFunctions.elementTextContent(CommonFunctions.getElementById('lc-country'), lc_to_upgrade_to.country);
        if (getPropertyValue(landing_company, ['financial_company', 'shortcode']) === 'maltainvest') {
            professionalClient.init(is_financial, false);
        }
        Geocoder.init(form_id);
    };

    const getResidence = (form_id, getValidations) => {
        BinarySocket.send({ residence_list: 1 }).then((response) => {
            handleResidenceList(response.residence_list, form_id, getValidations);
        });
    };

    const handleResidenceList = (residence_list, form_id, getValidations) => {
        if (residence_list.length > 0) {
            const $place_of_birth = $('#place_of_birth');
            const $tax_residence  = $('#tax_residence');
            const $phone          = $('#phone');
            const residence_value = Client.get('residence') || '';
            let residence_text    = '';

            const $options               = $('<div/>');
            const $options_with_disabled = $('<div/>');
            residence_list.forEach((res) => {
                $options.append(CommonFunctions.makeOption({ text: res.text, value: res.value }));
                $options_with_disabled.append(CommonFunctions.makeOption({
                    text       : res.text,
                    value      : res.value,
                    is_disabled: res.disabled,
                }));

                if (residence_value === res.value) {
                    residence_text = res.text;
                    if (res.phone_idd && !$phone.val()) {
                        $phone.val(`+${res.phone_idd}`);
                    }
                }
            });

            $('#lbl_residence').html($('<strong/>', { text: residence_text }));

            if ($place_of_birth.length) {
                BinarySocket.wait('get_settings').then((response) => {
                    const place_of_birth = response.get_settings.place_of_birth;
                    if (place_of_birth) {
                        const txt_place_of_birth =
                              (residence_list.find(obj => obj.value === place_of_birth) || {}).text;
                        $place_of_birth.replaceWith($('<span/>', { text: txt_place_of_birth || place_of_birth, 'data-value': place_of_birth }));
                    } else {
                        $place_of_birth.html($options.html()).val(residence_value);
                    }
                    $place_of_birth.select2({
                        matcher(params, data) {
                            return SelectMatcher(params, data);
                        },
                    });
                });
            }

            if (/^(malta|maltainvest|iom)$/.test(State.getResponse('authorize.upgradeable_landing_companies'))) {
                const $citizen = $('#citizen');
                CommonFunctions.getElementById('citizen_row').setVisibility(1);
                if ($citizen.length) {
                    BinarySocket.wait('get_settings').then((response) => {
                        const citizen = response.get_settings.citizen;
                        if (citizen) {
                            const txt_citizen = (residence_list.find(obj => obj.value === citizen) || {}).text;
                            $citizen.replaceWith($('<span/>', { text: txt_citizen || citizen, 'data-value': citizen }));
                        } else {
                            $citizen.html($options.html()).val(residence_value);
                        }
                        $citizen.select2({
                            matcher(params, data) {
                                return SelectMatcher(params, data);
                            },
                        });
                    });
                }
            }

            if ($tax_residence) {
                $tax_residence.html($options_with_disabled.html()).promise().done(() => {
                    setTimeout(() => {
                        $tax_residence.select2()
                            .val(getTaxResidence() || residence_value).trigger('change')
                            .setVisibility(1);
                    }, 500);
                });
            }

            BinarySocket.send({ states_list: Client.get('residence') }).then(data => handleState(data.states_list, form_id, getValidations));
        }
    };

    const getTaxResidence = () => {
        const tax_residence = State.getResponse('get_settings.tax_residence');
        return (tax_residence ? tax_residence.split(',') : '');
    };

    const handleState = (states_list, form_id, getValidations) => {
        const address_state_id = '#address_state';
        BinarySocket.wait('get_settings').then((response) => {
            let $address_state = $(address_state_id);

            $address_state.empty();

            const client_state = response.get_settings.address_state;

            if (states_list && states_list.length > 0) {
                $address_state.append($('<option/>', { value: '', text: localize('Please select') }));
                states_list.forEach((state) => {
                    $address_state.append($('<option/>', { value: state.value, text: state.text }));
                });
                if (client_state) {
                    $address_state.val(client_state);
                }
                $address_state.select2({
                    matcher(params, data) {
                        return SelectMatcher(params, data);
                    },
                });
            } else {
                $address_state.replaceWith($('<input/>', { id: 'address_state', name: 'address_state', type: 'text', maxlength: '35', 'data-lpignore': true }));
                $address_state = $(address_state_id);
                if (client_state) {
                    $address_state.text(client_state);
                }
            }
            $address_state.parent().parent().setVisibility(1);

            if (form_id && typeof getValidations === 'function') {
                FormManager.init(form_id, getValidations());
            }
        });
    };

    const handleNewAccount = (response, message_type) => {
        if (response.error) {
            const errorMessage = response.error.message;
            $('#submit-message').empty();
            $('#client_message').find('.notice-msg').text(response.msg_type === 'sanity_check' ? localize('There was some invalid character in an input field.') : errorMessage).end()
                .setVisibility(1);
        } else {
            localStorage.setItem('is_new_account', 1);
            Client.processNewAccount({
                email       : Client.get('email'),
                loginid     : response[message_type].client_id,
                token       : response[message_type].oauth_token,
                redirect_url: urlFor('user/set-currency'),
            });
        }
    };

    const commonValidations = () => {
        const req = [
            { selector: '#salutation',       validations: ['req'] },
            { selector: '#first_name',       validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]] },
            { selector: '#last_name',        validations: ['req', 'letter_symbol', ['length', { min: 2, max: 30 }]] },
            { selector: '#date_of_birth',    validations: ['req'] },
            { selector: '#address_line_1',   validations: ['req', 'address', ['length', { min: 1, max: 70 }]] },
            { selector: '#address_line_2',   validations: ['address', ['length', { min: 0, max: 70 }]] },
            { selector: '#address_city',     validations: ['req', 'letter_symbol', ['length', { min: 1, max: 35 }]] },
            { selector: '#address_state',    validations: $('#address_state').prop('nodeName') === 'SELECT' ? '' : ['letter_symbol', ['length', { min: 0, max: 35 }]] },
            { selector: '#address_postcode', validations: [Client.get('residence') === 'gb' ? 'req' : '', 'postcode', ['length', { min: 0, max: 20 }]] },
            { selector: '#phone',            validations: ['req', 'phone', ['length', { min: 6, max: 35, value: () => $('#phone').val().replace(/^\+/, '') }]] },
            { selector: '#secret_question',  validations: ['req'] },
            { selector: '#secret_answer',    validations: ['req', 'general', ['length', { min: 4, max: 50 }]] },
            { selector: '#tnc',              validations: [['req', { message: localize('Please accept the terms and conditions.') }]], exclude_request: 1 },

            { request_field: 'residence',   value: Client.get('residence') },
            { request_field: 'client_type', value: () => ($('#chk_professional').is(':checked') ? 'professional' : 'retail') },
        ];

        if (Cookies.get('affiliate_tracking')) {
            req.push({ request_field: 'affiliate_token', value: Cookies.getJSON('affiliate_tracking').t });
        }

        return req;
    };

    const selectCheckboxValidation = (form_id) => {
        const validations = [];
        let validation,
            id;
        $(form_id).find('select, input[type=checkbox]').each(function () {
            id = $(this).attr('id');
            if (!/^(tnc|address_state|chk_professional|chk_tax_id|citizen)$/.test(id)) {
                validation = { selector: `#${id}`, validations: ['req'] };
                if (id === 'not_pep') {
                    validation.exclude_request = 1;
                    validation.validations = [['req', { message: localize('Please confirm that you are not a politically exposed person.') }]];
                }
                validations.push(validation);
            }
        });
        return validations;
    };

    const showHidePulser = (should_show) => { $('.upgrademessage').children('a').setVisibility(should_show); };

    return {
        redirectAccount,
        populateForm,
        handleNewAccount,
        commonValidations,
        selectCheckboxValidation,
        showHidePulser,
    };
})();

module.exports = AccountOpening;
