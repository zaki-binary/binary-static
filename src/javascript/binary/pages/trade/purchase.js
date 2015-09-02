/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

var Purchase = (function () {
    'use strict';

    var display = function (details) {
        var receipt = details['open_receipt'],
            container = document.getElementById('contract_confirmation_container'),
            message_container = document.getElementById('confirmation_message_container'),
            fragment = document.createDocumentFragment(),
            h3 = document.createElement('h3'),
            message = document.createElement('p'),
            content = '';

        while (message_container && message_container.firstChild) {
            message_container.removeChild(message_container.firstChild);
        }

        h3.setAttribute('class', 'contract_purchase_heading');

        if (details['error'] || details['open_receipt']['error']) {
            var errorMsg = details['error']['message'] || details['open_receipt']['error'];
            content = document.createTextNode(errorMsg);
            message.appendChild(content);
            fragment.appendChild(message);
        } else {
            var txnInfo = document.createElement('div');

            content = document.createTextNode('Contract Confirmation');
            h3.appendChild(content);
            txnInfo.appendChild(h3);

            content = document.createTextNode(receipt['longcode']);
            message.appendChild(content);
            txnInfo.appendChild(message);

            content = document.createTextNode('Your transaction reference is ' + receipt['trx_id']);
            message = document.createElement('p');
            message.appendChild(content);
            txnInfo.appendChild(message);

            content = document.createTextNode('Your current balance is ' + receipt['balance_after']);
            message = document.createElement('p');
            message.appendChild(content);
            txnInfo.appendChild(message);

            fragment.appendChild(txnInfo);
        }

        if (message_container) {
            message_container.appendChild(fragment);
        }
        if (container) {
            container.style.display = 'block';
            container.insertBefore(message_container, document.getElementById('confirmation_message_endelement'));
        }
    };

    return {
        display: display,
    };

})();
