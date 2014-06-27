$(document).ready(function(){
    var form = $('form#list_request_files');
    form.find('select').change(function(){
        $.ajax({
            url: 'f_bbdl_scheduled_request_files.cgi',
            data: form.serialize(),
            dataType: 'json',
            type: 'POST',
            success: function(data, testStatus, jqXHR){
            console.log(data);
                if(data.success == 1) {
                    table = $('#request_file_table');
                    table.find('tr').remove();
                    var t_rows = JSON.parse(data.rows);
                    $.each(t_rows, function(i,val) {
                        var new_row;
                        if (val['time']) {
                            new_row = $('<tr></tr>').append('<td><a href='+val['file_url']+'>'+val['filename']+' ('+val['frequency']+' at '+val['time']+')</a>');
                        } else {
                            new_row = $('<tr></tr>').append('<td><a href='+val['file_url']+'>'+val['filename']+' ('+val['frequency']+')</a>');
                        }
                        table.append(new_row);
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {alert(textStatus)}
        });
    });
    return false;
});

$(function(){
    $("form[id^='corp_action_']").submit(function(){
        form = $(this);
        $.ajax({
            url: "corporate_actions.cgi",
            data: form.serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(data, testStatus, jqXHR){
                var message;
                if (data.success) {
                    message = 'Updated';
                } else {
                    message = 'Update failed. Reason: ' + data.reason;
                }
                $("div[class=button_"+data.id+"]").hide();
                $("div[class=status_"+data.id+"]").text(message);
            },
            error: function(jqXHR, textStatus, errorThrown) {alert(textStatus)},
        });
        return false;
    });
});
