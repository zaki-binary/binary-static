const Contract_Beta      = require('./contract');
const TickDisplay_Beta   = require('./tick_trade');
const commonTrading      = require('../common');
const Symbols            = require('../symbols');
const Tick               = require('../tick');
const Client             = require('../../../base/client');
const formatMoney        = require('../../../common/currency').formatMoney;
const elementInnerHtml   = require('../../../../_common/common_functions').elementInnerHtml;
const elementTextContent = require('../../../../_common/common_functions').elementTextContent;
const getElementById     = require('../../../../_common/common_functions').getElementById;
const isVisible          = require('../../../../_common/common_functions').isVisible;
const localize           = require('../../../../_common/localize').localize;
const toTitleCase        = require('../../../../_common/string_util').toTitleCase;
const createElement      = require('../../../../_common/utility').createElement;

/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

const Purchase_Beta = (() => {
    let purchase_data = {};

    const display = (details) => {
        purchase_data = details;

        const receipt                     = details.buy;
        const passthrough                 = details.echo_req.passthrough;
        const container                   = getElementById('contract_confirmation_container');
        const message_container           = getElementById('confirmation_message');
        const heading                     = getElementById('contract_purchase_heading');
        const descr                       = getElementById('contract_purchase_descr');
        const barrier_element             = getElementById('contract_purchase_barrier');
        const chart                       = getElementById('tick_chart');
        const brief                       = getElementById('contract_purchase_brief');
        const balance                     = getElementById('contract_purchase_balance');
        const payout                      = getElementById('contract_purchase_payout');
        const cost                        = getElementById('contract_purchase_cost');
        const spots                       = getElementById('contract_purchase_spots');
        const confirmation_error          = getElementById('confirmation_error');
        const confirmation_error_contents = getElementById('confirmation_error_contents');
        const contracts_list              = getElementById('contracts_list');
        const button                      = getElementById('contract_purchase_button');

        const error      = details.error;
        const show_chart = !error && passthrough.duration <= 10 && passthrough.duration_unit === 't' && (sessionStorage.formname === 'risefall' || sessionStorage.formname === 'higherlower' || sessionStorage.formname === 'asian');

        contracts_list.style.display = 'none';

        if (error) {
            container.style.display = 'block';
            message_container.hide();
            confirmation_error.show();
            elementInnerHtml(confirmation_error_contents, error.message);
        } else {
            getElementById('guideBtn').style.display = 'none';
            container.style.display = 'block';
            message_container.show();
            confirmation_error.hide();

            $('#contract-values').find('td').each(function () {
                $(this).text('').removeAttr('class', '');
            });
            const purchase_passthrough = purchase_data.echo_req.passthrough;
            elementTextContent(brief, `${$('#underlying').find('option:selected').text()} / ${toTitleCase(Contract_Beta.contractType()[Contract_Beta.form()][purchase_passthrough.contract_type])}${(Contract_Beta.form() === 'digits' && !/even|odd/i.test(purchase_passthrough.contract_type) ? ` ${purchase_passthrough.barrier}` : '')}`);

            elementTextContent(heading, localize('Contract Confirmation'));
            elementTextContent(descr, receipt.longcode);
            commonTrading.labelValue(barrier_element, '', '', true);
            [].forEach.call(document.getElementsByClassName('contract_purchase_reference'), (ref) => {
                elementTextContent(ref, `${localize('Ref.')} ${receipt.transaction_id}`);
            });

            let payout_value,
                cost_value;

            if (passthrough.basis === 'payout') {
                payout_value = passthrough.amount;
                cost_value   = passthrough['ask-price'];
            } else {
                cost_value   = passthrough.amount;
                payout_value = receipt.payout;
            }

            chart.hide();
            spots.hide();

            const currency = Client.get('currency');

            commonTrading.labelValue(payout, localize('Payout'), formatMoney(currency, payout_value, 1));
            commonTrading.labelValue(cost, localize('Stake'), formatMoney(currency, cost_value, 1));

            elementInnerHtml(balance, `${localize('Account balance:')} ${formatMoney(currency, receipt.balance_after)}`);

            if (show_chart) {
                chart.show();
            }

            if (Contract_Beta.form() === 'digits') {
                [].forEach.call(spots.childNodes, (child) => { elementInnerHtml(child, '&nbsp;'); });
                spots.show();
            }

            if (Contract_Beta.form() !== 'digits' && !show_chart) {
                button.setAttribute('contract_id', receipt.contract_id);
                descr.show();
                button.show();
                $('#confirmation_message').find('.open_contract_details').attr('contract_id', receipt.contract_id).setVisibility(1);
            } else {
                descr.hide();
                button.hide();
                $('#confirmation_message').find('.open_contract_details').setVisibility(0);
            }
        }

        if (show_chart) {
            let contract_sentiment;
            if (passthrough.contract_type === 'CALL' || passthrough.contract_type === 'ASIANU') {
                contract_sentiment = 'up';
            } else {
                contract_sentiment = 'down';
            }

            // calculate number of decimals needed to display tick-chart according to the spot
            // value of the underlying
            let decimal_points     = 2;
            const tick_spots       = Tick.spots();
            const tick_spot_epochs = Object.keys(tick_spots);
            if (tick_spot_epochs.length > 0) {
                const last_quote = tick_spots[tick_spot_epochs[0]].toString();

                if (last_quote.indexOf('.') !== -1) {
                    decimal_points = last_quote.split('.')[1].length;
                }
            }

            TickDisplay_Beta.init({
                contract_sentiment,
                symbol              : passthrough.symbol,
                barrier             : sessionStorage.getItem('formname') === 'higherlower' ? passthrough.barrier : undefined,
                number_of_ticks     : passthrough.duration,
                previous_tick_epoch : receipt.start_time,
                contract_category   : sessionStorage.getItem('formname') === 'asian' ? 'asian' : 'callput',
                display_symbol      : Symbols.getName(passthrough.symbol),
                contract_start      : receipt.start_time,
                display_decimals    : decimal_points,
                price               : passthrough['ask-price'],
                payout              : receipt.payout,
                show_contract_result: 1,
                width               : $('#tick_chart').width(),
                is_trading_page     : true,
            });
            TickDisplay_Beta.resetSpots();
        }
    };

    const updateSpotList = () => {
        if ($('#contract_purchase_spots:hidden').length) {
            return;
        }

        let duration = purchase_data.echo_req && purchase_data.echo_req.passthrough ?
            purchase_data.echo_req.passthrough.duration : null;

        if (!duration) {
            return;
        }

        const container = getElementById('contract_purchase_spots');
        const tick_elem = getElementById('current_tick_number');
        const spot_elem = getElementById('current_tick_spot');
        const list_elem = getElementById('last_digits_list');

        tick_elem.innerHTML = spot_elem.innerHTML = list_elem.innerHTML = '&nbsp;';

        for (let i = 1; i <= duration; i++) {
            const fragment = createElement('div', { class: 'gr-row' });

            const digit_elem = createElement('div', { class: 'digit', id: `tick_digit_${i}` });
            elementInnerHtml(digit_elem, '&nbsp;');
            fragment.appendChild(digit_elem);

            const number_elem = createElement('div', { class: 'number' });
            elementInnerHtml(number_elem, i);
            fragment.appendChild(number_elem);

            list_elem.appendChild(fragment);
        }

        const spots2    = Tick.spots();
        const epoches   = Object.keys(spots2).sort((a, b) => a - b);
        let tick_number = 0;

        const is_win   = (last_digit) => {
            const contract_type = purchase_data.echo_req.passthrough.contract_type;
            const barrier       = purchase_data.echo_req.passthrough.barrier;
            return ((contract_type === 'DIGITMATCH' && last_digit === barrier) ||
                    (contract_type === 'DIGITDIFF'  && last_digit !== barrier) ||
                    (contract_type === 'DIGITEVEN'  && last_digit % 2 === 0)   ||
                    (contract_type === 'DIGITODD'   && last_digit % 2)         ||
                    (contract_type === 'DIGITOVER'  && last_digit > barrier)   ||
                    (contract_type === 'DIGITUNDER' && last_digit < barrier));
        };
        let last_digit = null;
        const replace  = (d) => {
            last_digit = d;
            return `<span class="${(is_win(d) ? 'profit' : 'loss')}">${d}</span>`;
        };
        for (let s = 0; s < epoches.length; s++) {
            const tick_d = {
                epoch: epoches[s],
                quote: spots2[epoches[s]],
            };

            if (isVisible(container) && tick_d.epoch && tick_d.epoch > purchase_data.buy.start_time) {
                tick_number++;

                elementTextContent(tick_elem, `${localize('Tick')} ${tick_number}`);
                elementInnerHtml(spot_elem, tick_d.quote.replace(/\d$/, replace));

                const this_digit_elem = getElementById(`tick_digit_${tick_number}`);
                this_digit_elem.classList.add(is_win(last_digit) ? 'profit' : 'loss');
                elementTextContent(this_digit_elem, last_digit);

                if (last_digit && duration === 1) {
                    let contract_status,
                        final_price,
                        pnl;

                    if (is_win(last_digit)) {
                        final_price     = $('#contract_purchase_payout_value').attr('value');
                        pnl             = $('#contract_purchase_cost_value').attr('value');
                        contract_status = localize('This contract won');
                    } else {
                        final_price     = 0;
                        pnl             = -$('#contract_purchase_cost_value').attr('value');
                        contract_status = localize('This contract lost');
                    }

                    commonTrading.updatePurchaseStatus_Beta(final_price, pnl, contract_status);
                }

                duration--;
                if (!duration) {
                    purchase_data.echo_req.passthrough.duration = 0;
                }
            }
        }
    };

    return {
        display,
        updateSpotList,
    };
})();

module.exports = Purchase_Beta;
