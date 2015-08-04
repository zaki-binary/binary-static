var displayListElements = function (id, elements, selected) {
    'use strict';
    var target = document.getElementById(id),
        fragment = document.createDocumentFragment(),
        len = elements.length;

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    elements.forEach(function (element) {
        var li = document.createElement('li'),
            content = document.createTextNode(element);
        li.setAttribute('id', element.toLowerCase());
        if (selected && selected == element.toLowerCase()) {
            li.setAttribute('class', 'active');
        }
        li.appendChild(content);
        fragment.appendChild(li);
    });
    target.appendChild(fragment);
};

var displayOptions = function (id, elements, selected) {
    'use strict';
    var target= document.getElementById(id),
        fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var key in elements) {
        if (elements.hasOwnProperty(key)){
            var option = document.createElement('option'), content = document.createTextNode(elements[key]);
            option.setAttribute('value', key);
            if (selected && selected == key) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
    }
    target.appendChild(fragment);
};

var getFormNameBarrierCategory = function (displayFormName) {
    'use strict';
    var obj = {};
    if (displayFormName) {
        if(displayFormName == 'risefall') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_atm';
        } else if (displayFormName == 'higherlower') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_non_atm';
        } else if (displayFormName == 'callput'){
            obj['formName'] = displayFormName;
            obj['barrierCategory'] = 'euro_atm';
        } else {
            obj['formName'] = displayFormName;
            obj['barrierCategory'] = '';
        }
    } else {
        obj['formName'] = 'callput';
        obj['barrierCategory'] = 'euro_atm';
    }
    return obj;
};

var contractTypeDisplayMapping = function (type) {
    'use strict';
    var obj = {
        CALL: "top",
        PUT: "bottom",
        ASIANU: "top",
        ASIAND: "bottom",
        DIGITMATCH: "top",
        DIGITDIFF: "bottom",
        EXPIRYRANGE: "top",
        EXPIRYMISS: "bottom",
        RANGE: "top",
        UPORDOWN: "bottom",
        ONETOUCH: "top",
        NOTOUCH: "bottom",
    };

    return type ? obj[type] : 'top';
};
