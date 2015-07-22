function displayBarriers (barriers, formName, barrierCategory) {
    if (barriers && formName) {
        var barrier = barriers[formName];
        if(barrier) {
            if (barrier.count == 1) {
                document.querySelector('#high_barrier_row').style.display = 'none';
                document.querySelector('#low_barrier_row').style.display = 'none';
                document.querySelector('#barrier_row').setAttribute('style', '');

                var elm = document.querySelector('#barrier');
                elm.value = barrier.barrier;
                elm.textContent = barrier.barrier;
            } else if (barrier.count == 2) {
                document.querySelector('#barrier_row').style.display = 'none';
                document.querySelector('#high_barrier_row').setAttribute('style', '');
                document.querySelector('#low_barrier_row').setAttribute('style', '');

                var high_elm = document.querySelector('#barrier_high');
                high_elm.value = barrier['barrier'];
                high_elm.textContent = barrier['barrier'];

                var low_elm = document.querySelector('#barrier_low');
                low_elm.value = barrier['barrier1'];
                low_elm.textContent = barrier['barrier1'];
            }
        } else {
            var elements = document.querySelectorAll('.barrier_class');
            for (var i = 0; i < elements.length; i++){
                elements[i].style.display = 'none';
            }
        }
    } else {
        var elements = document.querySelectorAll('.barrier_class');
        for (var i = 0; i < elements.length; i++){
            elements[i].style.display = 'none';
        }
    }
}
