const Cookies            = require('js-cookie');
const generateBirthDate  = require('./attach_dom/birth_date_picker');
const BinaryPjax         = require('../base/binary_pjax');
const Client             = require('../base/client');
const localize           = require('../base/localize').localize;
const State              = require('../base/storage').State;
const urlFor             = require('../base/url').urlFor;
const getPropertyValue   = require('../base/utility').getPropertyValue;
const makeOption         = require('../common_functions/common_functions').makeOption;
const FormManager        = require('../common_functions/form_manager');
const BinarySocket       = require('../websocket_pages/socket');
const professionalClient = require('../websocket_pages/user/account/settings/professional_client');
require('select2');

const AccountOpening = (() => {
    const redirectAccount = (account_type_ico) => { // eslint-disable-line consistent-return
        const response_landing_company = State.getResponse('landing_company');
        const response_get_settings    = State.getResponse('get_settings');
        if (response_landing_company && response_get_settings) {
            return redirect(account_type_ico, response_landing_company);
        }
        BinarySocket.wait('landing_company', 'get_settings').then(() => redirect(account_type_ico));
    };

    const redirect = (account_type_ico, response_landing_company) => {
        const upgrade_info = Client.getUpgradeInfo(response_landing_company || State.getResponse('landing_company'), undefined, account_type_ico);

        if (!upgrade_info.can_upgrade) {
            BinaryPjax.loadPreviousUrl();
            return true;
        }

        if (!upgrade_info.is_current_path) {
            BinaryPjax.load(upgrade_info.upgrade_link);
            return true;
        }
        return false;
    };

    const populateForm = (form_id, getValidations, is_financial, is_ico_only) => {
        getResidence();
        BinarySocket.send({ states_list: Client.get('residence') }).then(data => handleState(data.states_list, form_id, getValidations));
        generateBirthDate();
        if (Client.canRequestProfessional()) {
            professionalClient.init(is_financial, false, is_ico_only);
        }
    };

    const getResidence = () => {
        BinarySocket.send({ residence_list: 1 }).then(response => handleResidenceList(response.residence_list));
    };

    const handleResidenceList = (residence_list) => {
        if (residence_list.length > 0) {
            const $place_of_birth = $('#place_of_birth');
            const $tax_residence  = $('#tax_residence');
            const $phone          = $('#phone');
            const residence_value = Client.get('residence') || '';
            let residence_text    = '';

            const $options = $('<div/>');
            residence_list.forEach((res) => {
                $options.append(makeOption({ text: res.text, value: res.value }));

                if (residence_value === res.value) {
                    residence_text = res.text;
                    if (residence_value !== 'jp' && res.phone_idd && !$phone.val()) {
                        $phone.val(`+${res.phone_idd}`);
                    }
                }
            });

            $('#lbl_residence').html($('<strong/>', { text: residence_text }));
            $place_of_birth.html($options.html()).val(residence_value);
            if ($tax_residence) {
                $tax_residence.html($options.html()).promise().done(() => {
                    setTimeout(() => {
                        $tax_residence.select2()
                            .val(getTaxResidence() || residence_value).trigger('change')
                            .setVisibility(1);
                    }, 500);
                });
            }
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
            } else {
                $address_state.replaceWith($('<input/>', { id: 'address_state', name: 'address_state', type: 'text', maxlength: '35' }));
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
                is_ico_only : getPropertyValue(response, ['echo_req', 'account_type']) === 'ico',
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
            { selector: '#address_state',    validations: $('#address_state').prop('nodeName') === 'SELECT' ? '' : ['general', ['length', { min: 0, max: 35 }]] },
            { selector: '#address_postcode', validations: [Client.get('residence') === 'gb' ? 'req' : '', 'postcode', ['length', { min: 0, max: 20 }]] },
            { selector: '#phone',            validations: ['req', 'phone', ['length', { min: 6, max: 35, value: () => $('#phone').val().replace(/^\+/, '') }]] },
            { selector: '#secret_question',  validations: ['req'] },
            { selector: '#secret_answer',    validations: ['req', 'general', ['length', { min: 4, max: 50 }]] },
            { selector: '#tnc',              validations: [['req', { message: 'Please accept the terms and conditions.' }]], exclude_request: 1 },

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
            if (!/^(tnc|address_state|chk_professional)$/.test(id)) {
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

    return {
        redirectAccount,
        populateForm,
        handleNewAccount,
        commonValidations,
        selectCheckboxValidation,
    };
})();

module.exports = AccountOpening;
