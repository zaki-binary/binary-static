$(document).ready(function() {
    $('#volsurface_calibration').submit(function(){
        var form = $(this);
        var underlying = form.find("input[name='underlyings']").val().split(",");
        var underlyng_error = $('td.underlying_error');

        for (var i=0; i < underlying.length; i++) {
            if (underlying[i].match(/^frx/)) {
                underlying_error.text('This calibration model only works for indices. You have entered an invalid symbol['+underlying[i]+']').css('color','red').show();
                return false;
            }
        }
    });

    $('.content').hide();
    $('.heading').click(function() {
        if ($(this).find('a.more').text() == '+') {
            $(this).find('a.more').text('-');
        } else {
            $(this).find('a.more').text('+');
        }
        $(this).next('.content').slideToggle(300);
    });

    $('.save_calib').click(function() {
        var form = $(this).closest('form');
        var symbol = form.find('input[name=symbol]').val();
        var calibration_error = $('input[name=calibration_error_'+symbol+']').val();

        $.ajax({
            url: 'f_update_calibration.cgi',
            data: form.serialize(),
            dataType: 'json',
            type: 'POST',
            success: function(data, testStatus, jqXHR) {
                var message;
                if (data.success == 1) {
                    message = 'Update successful';
                } else {
                    message = 'Update failure. reason: '+data.reason;
                }
                $('span.'+symbol+'_update_output').text(message);
            },
        });
        return false;
    });

    $('input.calib_param').change(function(){
        var form = $(this).closest('form');
        var paramTable = $(this).closest('table');

        UpdateChartAndCalibratedIV(form, paramTable);
    });

    $('input.recalibrate').click(function() {
        var initial_guess = {};
        var form = $(this).closest('form');
        var table = $(this).closest('table');
        var symbol = form.find('input[name=symbol]').val();
        var model = form.find('input[name=model]').val();

        $(this).closest('table').find('tr#ori_param td').each(function() {
            var param_name = $(this).attr('name');
            var param_value = $(this).text();
            initial_guess[param_name] = param_value;
        });

        var newForm = $('<form></form>');
        newForm.append("<input type=hidden name='initial_guess' value='"+JSON.stringify(initial_guess)+"'/>");
        newForm.append("<input type=hidden name='symbol' value='"+symbol+"'/>");
        newForm.append("<input type=hidden name='model' value='"+model+"'/>");

        $.ajax({
            url: 'regenerate_calibration_param.cgi',
            data: newForm.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                if(data.success == 1) {
                    var new_param = JSON.parse(data.new_params);
                    for (param_name in new_param) {
                        form.find('tr#ori_param td[name='+param_name+']').text(new_param[param_name]);
                        form.find('tr#altered_param td input[name='+param_name+']').val(new_param[param_name]);
                    }
                    UpdateChartAndCalibratedIV(form, table);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var table = $('.'+symbol+'_lv');
                table.before('<p class="failure">Could not regenerate calibration param: '+textStatus+' '+errorThrown+'</p>');
            },
        });
        return false;
    });
});

function UpdateChartAndCalibratedIV (form, table) {
    var ori_param = {};

    table.find('tr#ori_param td').each(function(){
        var param_name = $(this).attr('name');
        var param_value = $(this).text();
        ori_param[param_name] = param_value;
    });

    var altered = {};
    table.find('tr#altered_param td').each(function(){
        var param_name = $(this).find('input.calib_param').attr('name');
        var param_value = $(this).find('input.calib_param').val();
        altered[param_name] = param_value;
    });

    var symbol = form.find('input[name=symbol]').val();
    var model = form.find('input[name=model]').val();
    var newForm = $('<form></form>');
    newForm.append("<input type=hidden name=symbol value='"+symbol+"'/>");
    newForm.append("<input type=hidden name=model value='"+model+"'/>");
    newForm.append("<input type=hidden name=ori value='"+JSON.stringify(ori_param)+"'/>");
    newForm.append("<input type=hidden name=altered value='"+JSON.stringify(altered)+"'/>");

    var ajax = $.ajax({
        url: 'regenerate_smile.cgi',
        data: newForm.serialize(),
        type: 'POST',
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            if (data.success == 1) {
                $("input[name='calibration_error_"+symbol+"']").val(data.new_calibration_error);
                var new_graphs = JSON.parse(data.new_graphs);
                for (d in new_graphs) {
                    $('img.'+symbol+'_img_'+d).attr('src',new_graphs[d]);
                }
                var new_surface = JSON.parse(data.new_surface);
                for (tenor in new_surface) {
                    for (point in new_surface[tenor]) {
                        $('table#'+symbol+'_calibrated_iv td.'+tenor+'_'+point).text(new_surface[tenor][point]);
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var table = $('.'+symbol+'_lv');
            table.before('<p class="failure">Could not regenerate calibration param: '+textStatus+' '+errorThrown+'</p>');
        },
    });
};

$(function(){
    $("input.save_all").click(function(){
        $("form[id$='_update']").each(function(){
            $(this).find("input.save_calib").trigger('click');
        });
        return false;
    });
});

$(function() {
    $("input[name$='_params_submit']").click(function() {
        var form = $(this).parent("form[id$='_params_update_form']");
        var content = form.parent('div.content');
        var underlying = form.find("input[name='underlying']").val();
        var output = $('span.'+underlying+'_output');
        var error = $('div.'+underlying+'_error');

        $.ajax({
                url: 'save_calibration_params.cgi',
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                success: function(data, textStatus, jqXHR) {
                    if (data.success) {
                        content.hide();
                        output.html('Update successful!').show();
                    } else {
                        error.html(data.reason).show();
                    }
                },
            });
        return false;
    });
});
