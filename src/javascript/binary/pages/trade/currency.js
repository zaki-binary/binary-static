var displayCurrencies = function (input, selected) {
    'use strict';

    var target= document.querySelector('#currency'),
        fragment =  document.createDocumentFragment(),
        currencies = input['payout_currencies'];

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    currencies.forEach(function (currency) {
        var option = document.createElement('option'),
            content = document.createTextNode(currency);

        option.setAttribute('value', currency);
        if (selected && selected == key) {
            option.setAttribute('selected', 'selected');
        }

        option.appendChild(content);
        fragment.appendChild(option);
    });

    target.appendChild(fragment);
};
