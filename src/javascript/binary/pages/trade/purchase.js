/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

var Purchase = (function () {
    'use strict';

    var display = function (details) {
        var receipt = details['buy'],
            form_data = details['echo_req']['form_data'],
            container = document.getElementById('contract_confirmation_container'),
            message_container = document.getElementById('confirmation_message'),
            heading = document.getElementById('contract_purchase_heading'),
            descr = document.getElementById('contract_purchase_descr'),
            reference = document.getElementById('contract_purchase_reference'),
            chart = document.getElementById('tick_chart'),
            balance = document.getElementById('contract_purchase_balance'),
            payout = document.getElementById('contract_purchase_payout'),
            cost = document.getElementById('contract_purchase_cost'),
            profit = document.getElementById('contract_purchase_profit'),
            confirmation_error = document.getElementById('confirmation_error'),
            contracts_list = document.getElementById('contracts_list');

        var error = details['error'];
        var show_chart = !error && form_data['duration']<=10 && form_data['duration_unit']==='t';

        container.style.display = 'block';
        contracts_list.style.display = 'none';

        if (error) {
            message_container.hide();
            confirmation_error.show();
            confirmation_error.textContent = error['message'];
        } else {
            message_container.show();
            confirmation_error.hide();

            heading.textContent = Content.localize().textContractConfirmationHeading;
            descr.textContent = receipt['longcode'];

            var payout_value, cost_value, profit_value;
            if(form_data.basis === "payout"){
                payout_value = form_data.amount_val;
                cost_value = form_data['ask-price'];
            }
            else{
                cost_value = form_data.amount_val;
                var match = receipt['longcode'].match(/\d+\.\d\d/);
                payout_value = match[0];
            }
            profit_value = Math.round((payout_value - cost_value)*100)/100;

            payout.innerHTML = Content.localize().textContractConfirmationPayout + ' <p>' + payout_value + '</p>';
            cost.innerHTML = Content.localize().textContractConfirmationCost + ' <p>' + cost_value + '</p>';
            profit.innerHTML = Content.localize().textContractConfirmationProfit + ' <p>' + profit_value + '</p>';

            balance.textContent = Content.localize().textContractConfirmationBalance + ' ' + receipt['balance_after'];

            if(show_chart){
                chart.show();
            }
            else{
                chart.hide();
            }
            
        }

        if(show_chart){
            TickDisplay.initialize({
                "symbol":form_data.symbol,
                "number_of_ticks":form_data.duration,
                "previous_tick_epoch":receipt['start_time'],
                "contract_category":"callput",

                "display_symbol":Symbols.getName(form_data.symbol),
                "contract_start":receipt['start_time'],
                "decimal":3,
                "contract_sentiment":(form_data['contract_type']==='CALL' ? 'up' : 'down'),
                "price":form_data['ask-price'],
                "payout":form_data['amount_val'],
                "show_contract_result":1
            })
        }
    };

    return {
        display: display,
    };

})();
