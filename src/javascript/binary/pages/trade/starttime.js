function compareStartDate(a,b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}

function displayStartDates(id, startDates) {
    'use strict';
    if (startDates) {
        var target= document.getElementById(id),
            fragment =  document.createDocumentFragment(),
            option = document.createElement('option'),
            content = document.createTextNode('Now');

        while (target && target.firstChild) {
            target.removeChild(target.firstChild);
        }

        option.setAttribute('value', 'now');
        option.appendChild(content);
        fragment.appendChild(option);

        startDates.sort(compareStartDate);

        for (var i = 0, len = startDates.length; i < len; i++) {
            var a = moment.unix(startDates[i].open).utc();
            var b = moment.unix(startDates[i].close).utc();

            var ROUNDING = 5 * 60 * 1000;
            var start = moment();
            start = moment(Math.ceil((+start) / ROUNDING) * ROUNDING).utc();

            if (moment(a, 'YYYY MM DD').isSame(moment(start ,'YYYY MM DD'))) {
                a = start;
            }

            while(a.isBefore(b)) {
                option = document.createElement('option');
                option.setAttribute('value', a.utc().unix());
                content = document.createTextNode(a.format('HH:mm ddd'));
                option.appendChild(content);
                fragment.appendChild(option);
                a.add(5, 'minutes');
            }
        }
        target.appendChild(fragment);
    } else {
        document.getElementById('date_start_row').style.display = 'none';
    }
}
