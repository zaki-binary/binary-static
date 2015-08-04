var displayCurrencies = function (input, selected) {
    'use strict';

    var target= document.querySelector('#currency'),
        fragment =  document.createDocumentFragment(),
        currencies = input['payout_currencies'];

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var i = 0, len = currencies.length; i < len; i++) {
        var option = document.createElement('option'),
            content = document.createTextNode(currencies[i]);

        option.setAttribute('value', currencies[i]);

        if (selected && selected == key) {
            option.setAttribute('selected', 'selected');
        }

        option.appendChild(content);
        fragment.appendChild(option);
    }
    target.appendChild(fragment);
};
