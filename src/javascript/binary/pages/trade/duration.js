var displayDurations = function (id, durations, formName, barrierCategory, startType) {
    'use strict';
    var target= document.getElementById(id),
        fragment =  document.createDocumentFragment(), durationContainer = {};

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var key in durations) {
        if (durations.hasOwnProperty(key)) {
            for (var form in durations[key][formName]) {
                if (durations[key][formName].hasOwnProperty(form)) {
                    var obj = {};
                    if (barrierCategory) {
                        obj = durations[key][formName][barrierCategory];
                    } else {
                        obj = durations[key][formName][form];
                    }
                    for (var type in obj) {
                        if (obj.hasOwnProperty(type)) {
                            if (startType) {
                                if (startType == type) {
                                    if(!durationContainer.hasOwnProperty(startType)) {
                                        durationContainer[key] = obj[startType];
                                    }
                                }
                            } else {
                                if(!durationContainer.hasOwnProperty(type)) {
                                    durationContainer[key] = obj[type];
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    for (var duration in durationContainer) {
        if(durationContainer.hasOwnProperty(duration)) {
            var min = durationContainer[duration]['min_contract_duration'], max = durationContainer[duration]['min_contract_duration'], textMapping = durationTextValueMappings(min);

            var option, content;
            if (duration == 'intraday') {
                switch (textMapping['value']) {
                    case 's':
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.appendChild(content);
                        fragment.appendChild(option);
                        option = document.createElement('option');
                        content = document.createTextNode('minutes');
                        option.setAttribute('value', 'm');
                        option.setAttribute('data-minimum', 1);
                        option.appendChild(content);
                        fragment.appendChild(option);
                        option = document.createElement('option');
                        content = document.createTextNode('hours');
                        option.setAttribute('value', 'h');
                        option.setAttribute('data-minimum', 1);
                        option.appendChild(content);
                        fragment.appendChild(option);
                        break;
                    case 'm':
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.appendChild(content);
                        fragment.appendChild(option);
                        option = document.createElement('option');
                        content = document.createTextNode('hours');
                        option.setAttribute('value', 'h');
                        option.setAttribute('data-minimum', 1);
                        option.appendChild(content);
                        fragment.appendChild(option);
                        break;
                    case 'h':
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.appendChild(content);
                        fragment.appendChild(option);
                        break;
                    default :
                        option = document.createElement('option');
                        content = document.createTextNode(textMapping['text']);
                        option.setAttribute('value', textMapping['value']);
                        option.setAttribute('data-minimum', textMapping['min']);
                        option.appendChild(content);
                        fragment.appendChild(option);
                        break;
                }
            } else if (duration == 'daily') {
                option = document.createElement('option');
                content = document.createTextNode(textMapping['text']);
                option.setAttribute('value', textMapping['value']);
                option.setAttribute('data-minimum', textMapping['min']);
                option.appendChild(content);
                fragment.appendChild(option);
            } else if (duration == 'tick') {
                option = document.createElement('option');
                content = document.createTextNode(textMapping['text']);
                option.setAttribute('value', textMapping['value']);
                option.setAttribute('data-minimum', textMapping['min']);
                option.appendChild(content);
                fragment.appendChild(option);
            }
            target.appendChild(fragment);
        }
    }
};

var durationTextValueMappings = function (str) {
    'use strict';
    var mapping = {
        s : 'seconds',
        m : 'minutes',
        h : 'hours',
        d : 'days',
        t : 'ticks'
    };

    var arry = str ? str.toString().match(/[a-zA-Z]+|[0-9]+/g) : [],
        obj = {};

    if (arry.length > 1) {
        obj['value'] = arry[1];
        obj['text'] = mapping[arry[1]];
        obj['min'] = arry[0];
    } else {
        obj['value'] = 't';
        obj['text'] = mapping['t'];
        obj['min'] = arry[0];
    }

    return obj;
};

var durationPopulate = function () {
    'use strict';
    var unit = document.getElementById("duration_units"), unitValue = unit.options[unit.selectedIndex].getAttribute('data-minimum');
    document.getElementById("duration_amount").value = unitValue;
    document.getElementById("duration_minimum").textContent = unitValue;
    displayExpiryType('expiry_type', unitValue);
};

var displayExpiryType = function (id, unit) {
    'use strict';
    var target= document.getElementById(id), fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    var option = document.createElement('option'), content = document.createTextNode('Durations');
    option.setAttribute('value', 'duration');
    option.appendChild(content);
    fragment.appendChild(option);

    if (unit != 't') {
        option = document.createElement('option');
        content = document.createTextNode('End Time');
        option.setAttribute('value', 'endtime');
        option.appendChild(content);
        fragment.appendChild(option);
    }
    target.appendChild(fragment);
};
