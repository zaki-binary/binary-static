$(function() {
    $.jsonify({
        getters: {
            anything: function() {
                if (this.find('input').size()) {
                    return this.find('input').val();
                }
                return this.html();
            }
        }
    });

    var moneyness_comparison = $('#moneyness-comparison');

    moneyness_comparison.find('form.update').each(function(index) {
        var form = $(this);
        var which = form.find('input[name=which]:checked').val();
        if (form.siblings('div.comparison').find('table.'+which).siblings('p.validity').hasClass('failure')) {
            form.find('input[type=submit]').attr('disabled', 'disabled');
        }
    });

    // Attach all events to children of moneyness_comparison as necessary.
    moneyness_comparison.delegate('form.update', 'submit', function() {
        var form = $(this);
        var inputs = form.find('input');
        var throbber = form.find('img');

        throbber.show();

        var which = form.find('input[name=which]:checked').val();
        var surface_table = form.siblings('div.comparison').find('table.'+which);
        var recorded_epoch = surface_table.siblings('span.recorded_epoch');
        var spot = surface_table.siblings('span.spot');
        var surface = surface_table.jsonify();

        form.find('input[name=surface], input[name=recorded_epoch], input[name=spot]').remove();
        form.siblings('p.failure').remove();

        $('<input>').attr({ type: 'hidden', name: 'surface', value: JSON.stringify(surface) }).appendTo(form);
        $('<input>').attr({ type: 'hidden', name: 'recorded_epoch', value: recorded_epoch.html() }).appendTo(form);
        $('<input>').attr({ type: 'hidden', name: 'spot', value: spot.html() }).appendTo(form);

        $.ajax({
            url: form.attr('action'),
            type: 'post',
            data: form.serialize(),
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                var message;
                if (data.success) {
                    form.hide();
                    message = '<p class="success">Updated successfully.</p>';
                    form.siblings('div.comparison').hide('slow');
                } else {
                    message = '<p class="failure">Update failed: '+data.reason+'.</p>';
                }
                form.before(message);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                form.before('<p class="failure">Update failed: '+textStatus+' '+errorThrown+'</p>');
            },
            complete: function() {
                throbber.hide();
            }
        });

        return false;
    })
    .delegate('form.update', 'change', function() {
        var form = $(this);

        var which = form.find('input[name=which]:checked').val();
        var p = form.siblings('div.comparison').find('table.'+which).siblings('p.validity');
        if (p.hasClass('success')) {
            form.find('input[type=submit]').removeAttr('disabled');
        } else {
            form.find('input[type=submit]').attr('disabled', 'disabled');
        }
    })
    .delegate('a.more', 'click', function() {
        var a = $(this);
        a.parent().siblings('div.comparison').toggle('slow');
        return false;
    })
    .delegate('table.BB td, table.SD td', 'click', function() {
        var td = $(this);

        if (td.find('input').size()) {
            return false;
        }

        var vol = td.html();
        td.html('<input type="text" size="8" value="'+vol+'"/>');
    })
    .delegate('table input', 'change', function() {
        var input = $(this);
        var surface_table = input.parents('table').first();
        var form = input.parents('div.comparison').siblings('form');
        var which = form.find('input[name=which]:checked').val();
        var p = surface_table.siblings('p.validity').hide();
        var throbber = p.siblings('img').show();

        form.find('input[type=submit]').attr('disabled', 'disabled');

        var data = {
            surface: JSON.stringify(surface_table.jsonify()),
            recorded_epoch: surface_table.siblings('span.recorded_epoch').html(),
            spot: surface_table.siblings('span.spot').html(),
            symbol: input.parents('div.comparison').siblings('div.item').find('span').html(),
            type: 'moneyness'
        };

        $.ajax({
            url: 'quant/validate_surface.cgi',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if (data.success) {
                    throbber.hide();
                    p.removeClass('failure').addClass('success');
                    p.html('Valid.').show();
                    if (surface_table.hasClass(which)) {
                        form.find('input[type=submit]').removeAttr('disabled');
                    }
                } else {
                    throbber.hide();
                    p.removeClass('success').addClass('failure');
                    p.html('Invalid: '+data.reason).show();
                    if (surface_table.hasClass(which)) {
                        form.find('input[type=submit]').attr('disabled', 'disabled');
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                p.after('<p>Error during validate_surface.cgi request: '+textStatus+' '+errorThrown+'</p>');
            }
        });
    });
});
