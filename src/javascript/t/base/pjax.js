module("Pjax");
test('PjaxExecQueue', function() {
    var queue = new PjaxExecQueue();
    var a = 1;
    queue.queue(function() { a = 2; });
    queue.fire();

    equal(a, 2, "Changed by fire");

    a = 3;
    equal(a, 3, "Does not fire again");

    queue.reset(); 
    queue.fire();
    equal(a, 2, "Fires after reset");

    queue = new PjaxExecQueue();
    //We are running this from run.html
    queue.queue_for_url(function() { a = 10; },'run');
    queue.queue_for_url(function() { a = 30; },'blink');

    queue.fire();
    equal(a, 10, "run url fired");

    queue = new PjaxExecQueue();
    //We are running this from run.html
    queue.queue_if_id_present(function() { a = 20; },'qunit');
    queue.queue_if_id_present(function() { a = 40; },'mojo');

    queue.fire();
    equal(a, 20, "id qunit fired");
});

test('pjax_config_page', function() {
    //Override the globals.
    onLoad = new PjaxExecQueue();
    onUnload = new PjaxExecQueue();

    var a = 1;
    pjax_config_page('run', function() {
        return {
            onLoad: function() {
                a = 10;
            },
            onUnload:  function() {
                a = 20;
            },
        };
    });

    onLoad.fire();
    equal(a, 10, 'onLoad Fired');

    onUnload.fire();
    equal(a, 20, 'onUnload Fired');
});
