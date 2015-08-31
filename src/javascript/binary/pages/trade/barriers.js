/*
 * Handles barrier processing and display
 *
 * It process `Contract.barriers` and display them if its applicable
 * for current `Offerings.form()
 */
function displayBarriers (barrierCategory) {
    'use strict';

    var barriers = Contract.barriers(),
        formName = Offerings.form();

    if (barriers && formName) {
        var barrier = barriers[formName];
        if(barrier) {
            var unit = document.getElementById('duration_units');
            var currentTick = Tick.quote();
            if (barrier.count === 1) {
                document.getElementById('high_barrier_row').style.display = 'none';
                document.getElementById('low_barrier_row').style.display = 'none';
                document.getElementById('barrier_row').setAttribute('style', '');

                var elm = document.getElementById('barrier');
                if (unit && unit.value === 'd' && currentTick) {
                    elm.value = parseFloat(currentTick) + parseFloat(barrier['barrier']);
                    elm.textContent = parseFloat(currentTick) + parseFloat(barrier['barrier']);
                } else {
                    elm.value = barrier['barrier'];
                    elm.textContent = barrier['barrier'];
                }
                return;
            } else if (barrier.count === 2) {
                document.getElementById('barrier_row').style.display = 'none';
                document.getElementById('high_barrier_row').setAttribute('style', '');
                document.getElementById('low_barrier_row').setAttribute('style', '');

                var high_elm = document.getElementById('barrier_high'),
                    low_elm = document.getElementById('barrier_low');

                if (unit && unit.value === 'd' && currentTick) {
                    high_elm.value = parseFloat(currentTick) + parseFloat(barrier['barrier']);
                    high_elm.textContent = parseFloat(currentTick) + parseFloat(barrier['barrier']);

                    low_elm.value = parseFloat(currentTick) + parseFloat(barrier['barrier1']);
                    low_elm.textContent = parseFloat(currentTick) + parseFloat(barrier['barrier1']);
                } else {
                    high_elm.value = barrier['barrier'];
                    high_elm.textContent = barrier['barrier'];

                    low_elm.value = barrier['barrier1'];
                    low_elm.textContent = barrier['barrier1'];
                }
                return;
            }
        }
    }

    var elements = document.getElementsByClassName('barrier_class');
    for (var i = 0; i < elements.length; i++){
        elements[i].style.display = 'none';
    }
}
