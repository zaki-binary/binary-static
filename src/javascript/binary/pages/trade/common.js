var displayListElements = function (id, elements, selected) {
    var target = document.getElementById(id),
        fragment = document.createDocumentFragment(),
        len = elements.length;

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var i = 0 ; i < len; i++) {
        var li = document.createElement('li'), content = document.createTextNode(elements[i]);
        li.setAttribute('id', elements[i].toLowerCase());
        if (selected == elements[i].toLowerCase()) {
            li.setAttribute('class', 'active');
        }
        li.appendChild(content);
        fragment.appendChild(li);
    }
    target.appendChild(fragment);
};

var displayOptions = function (id, elements, selected) {
    var target= document.getElementById(id),
        fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var key in elements) {
        if (elements.hasOwnProperty(key)){
            var option = document.createElement('option'), content = document.createTextNode(elements[key]);
            option.setAttribute('value', key);
            if (selected == key) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
    }
    target.appendChild(fragment);
};

var getFormNameBarrierCategory = function (displayFormName) {
    var obj = {};
    if (displayFormName) {
        if(displayFormName == 'risefall') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_atm';
        } else if (displayFormName == 'higherlower') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_non_atm';
        } else {
            obj['formName'] = displayFormName;
        }
    } else {
        obj['formName'] = 'callput';
        obj['barrierCategory'] = 'euro_atm';
    }
    return obj;
};
