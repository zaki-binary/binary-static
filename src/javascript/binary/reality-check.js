RealityCheck = (function ($) {
    "use strict";

    var reality_check_url = page.url.url_for('user/reality_check');

    function RealityCheck(cookieName, persistentStore, logoutLocation) {
        var val;
        
        this.cookieName = cookieName;
        this.storage = persistentStore;

        val = parseInt($.cookie(this.cookieName).split(',')[0]);
        if (!val>0) return;     // no or invalid cookie

        this.logoutLocation = logoutLocation;
        if (!this.logoutLocation) return; // not logged in?

        this.interval = parseInt(val) * 60 * 1000; // convert minutes to millisec

        val = persistentStore.get('reality_check.basetime');
        if (!val>0) {           // just logged in
            val = (new Date).getTime();
            persistentStore.set('reality_check.basetime', val);
            persistentStore.set('reality_check.ack', 1);
        }
        this.basetime = val;

        return this.setAlarm();
    };

    RealityCheck.prototype.setAlarm = function () {
        var that = this;
        var alrm = this.interval - ((new Date).getTime() - this.basetime) % this.interval;

        if (this.tmout) window.clearTimeout(this.tmout);

        this.tmout = window.setTimeout(function () {
            that.fire();
        }, alrm);
    };

    RealityCheck.prototype.fire = function () {
        var that = this;

        $.ajax({
            url: reality_check_url,
            dataType: 'text',
            success: function (data) {
                that.display(data);
            },
            error: function (xhr) {
                if (xhr.status === 404) return; // no MF loginid
                window.setTimeout(function () {
                    that.fire();
                }, 5000)
            },
        });
    };

    RealityCheck.prototype.display = function (data) {
        var that = this, outer, middle, storage_handler; 

        if (outer = $('#reality-check')) outer.remove();

        outer = $("<div id='reality-check'></div>").css({
            'display':          'table',
            'position':         'fixed',
            'top':              '0',
            'left':             '0',
            'width':            '100%',
            'height':           '100%',
            'background-color': 'rgba(0,0,0,.7)',
            'z-index':          '20000',
        }).appendTo('body');
        middle = $('<div />').css({
            'display':        'table-cell',
            'vertical-align': 'middle',
        }).appendTo(outer);
        $('<div>' + data + '</div>').css({
            'margin-left':      'auto',
            'margin-right':     'auto',
            'padding':          '.5em .5em',
            'width':            '44em',
            'text-align':       'center',
            'background-color': '#fff',
            'border-radius':    '.3em',
        }).appendTo(middle);

        storage_handler = function (jq_event) {
            var ack;

            if (jq_event.originalEvent.key !== 'reality_check.ack') return;
            ack = parseInt(jq_event.originalEvent.newValue || 1);
            if (ack > that.lastAck) {
                $(window).off('storage', storage_handler);
                that.setAlarm();
                $('#reality-check').remove();
            }
        };

        // in case the client works with multiple windows, check if he has acknowleged
        // it in another window.
        $(window).on('storage', storage_handler);

        this.lastAck = parseInt(this.storage.get('reality_check.ack') || 1);
        $('#reality-check [bcont=1]').on('click', function () {
            that.storage.set('reality_check.ack', that.lastAck+1);
            $(window).off('storage', storage_handler);
            that.setAlarm();
            $('#reality-check').remove();
        });

        $('#reality-check .blogout').on('click', function () {
            window.location.href = that.logoutLocation;
        });
    };

    return RealityCheck;
}(jQuery));

onLoad.queue(function () {
    var logoutBtn = $('#btn_logout')[0];
    if (!logoutBtn) return;
    new RealityCheck('rck', LocalStore, logoutBtn.getAttribute('href'));
});
