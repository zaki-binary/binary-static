const BinaryPjax   = require('../base/binary_pjax');
const Client       = require('../base/client');
const BinarySocket = require('../base/socket');
const jpClient     = require('../common/country_base').jpClient;
const jpResidence  = require('../common/country_base').jpResidence;
const localize     = require('../../_common/localize').localize;
const State        = require('../../_common/storage').State;
const template     = require('../../_common/utility').template;

const CashierJP = (() => {
    const onLoad = (action) => {
        if (jpClient() && !jpResidence()) BinaryPjax.loadPreviousUrl();
        const $container = $('#japan_cashier_container');
        BinarySocket.wait('get_settings').then(() => {
            $container.setVisibility(1);
            if (action === 'deposit') {
                $('#name_id').text(`${(Client.get('loginid') || 'JP12345')} ${(State.getResponse('get_settings.first_name') || 'Joe Bloggs')}`);
            } else if (action === 'withdraw') {
                $('#id123-control22598118').val(Client.get('loginid'));
                $('#id123-control22598060').val(Client.get('email'));
                $('#japan_cashier_container button').on('click', (e) => {
                    const result = errorHandler();
                    if (!result) e.preventDefault();
                });
            }
        });
    };

    const errorHandler = () => {
        $('.error-msg').remove();
        const $id               = $('#id123-control22598145');
        const withdrawal_amount = $id.val();

        const showError = (message) => {
            $id.parent().append($('<p/>', { class: 'error-msg', text: localize(message) }));
        };

        if (!/^([1-9][0-9]{0,5}|1000000)$/.test(withdrawal_amount)) {
            showError(template('Please enter a number between [_1].', ['¥1 - ¥1,000,000']));
            return false;
        } else if (parseInt(Client.get('balance')) < withdrawal_amount) {
            showError('Insufficient balance.');
            return false;
        }
        return true;
    };

    return {
        errorHandler,

        Deposit : { onLoad: () => { onLoad('deposit'); } },
        Withdraw: { onLoad: () => { onLoad('withdraw'); } },
    };
})();

module.exports = CashierJP;
