function WinPopupSearchClients(broker,collector_server) {
    broker = page.settings.get('broker');
    newWindow = window.open(
        '/d/f_brokercgi/f_popupclientsearch.cgi?broker='+broker,
        'ClientSearch',
        'width=1200,height=220,toolbar=no,directories=no,status=no,scrollbars=yes,resize=no,menubar=no'
    );
}

function CheckLoginIDformat(forminput)
{
	if (forminput.value === '')
	{
		return true;
	}

	if (!forminput.value.match(/^\D+\d+$/))
	{
		alert('The loginID is not input correctly.');
		return(false);
	}

	if (!(new RegExp('^'+page.settings.get('broker'),'i')).test(forminput.value))
	{
		alert('The loginID should start with '+page.settings.get('broker')+'.');
		return(false);
	}
	return true;
}

function IPWin(url)
{
	newWindow = window.open(url,"IPresolver","toolbar=no,width=700,height=480,directories=no,status=no,scrollbars=yes,resize=no,menubar=no");
}

function setPointer(theRow, thePointerColor)
{
	if (thePointerColor == '' || typeof(theRow.style) == 'undefined')
	{
		return false;
	}

	var theCells;
	if (typeof(document.getElementsByTagName) != 'undefined')
	{
		theCells = theRow.getElementsByTagName('td');
	}
	else if (typeof(theRow.cells) != 'undefined')
	{
		theCells = theRow.cells;
	}
	else
	{
		return false;
	}

	var rowCellsCnt  = theCells.length;
	for (var c = 0; c < rowCellsCnt; c++)
	{
		theCells[c].style.backgroundColor = thePointerColor;
	}
	return true;
}

function confirmDownloadCSV(day)
{
	return confirm('Download CSV will auto withdraw funds from all the disabled accounts where last access day is more than ' + day + ' days. Do you still want to continue?');
}

function SetTelCategoryVisibility(contact_type)
{
	var telCategory = document.getElementById('telCategory');
	var sendOutSurveyRow = document.getElementById('sendoutsurvey_row');

	if (telCategory)
	{
		if (contact_type == 'Telephone')
		{
			telCategory.style.visibility   = 'visible';
			sendOutSurveyRow.style.display = '';
		}
		else
		{
			telCategory.style.visibility   = 'hidden';
			sendOutSurveyRow.style.display = 'none';
		}
	}
}

function SetSelectOptionVisibility(option_value)
{
    var StatementOption = document.getElementById('StatementOption');
    var ProfitTableOption = document.getElementById('ProfitTableOption');

    if (StatementOption) {
        StatementOption.style.display = option_value == 'Statement'? 'inline-block': 'none';
    }

    if (ProfitTableOption) {
        ProfitTableOption.style.display = option_value == 'Profit Table'? 'inline-block': 'none';
    }
}

function toggle_dcc_table(that)
{
	if (that.title != that.value)
	{
		$('#dcc_' + that.name).show();
	}
	else
	{
		$('#dcc_' + that.name).hide();
	}
}
function affiliate_modification_status(that)
{
	if (that.checked)
    {
        $('.affiliate_field').removeAttr('disabled');
	}
    else
    {
        $('.affiliate_field').attr('disabled', 'disabled');
    }
}

$(document).ready(function ()
{
    $('form.bo_ajax_form').bind('submit', function (event)
    {
        var this_form = $(event.target);

        if (this_form.attr('id') != 'paymentDCC')
        {
            if (!confirm('Are you sure you want to continue?'))
            {
                return false;
            }
        }

        event.preventDefault();

        var bo_ajax_form_response_container = this_form.find('div.bo_ajax_form_response_container');
        var bo_ajax_form_response_content_container = null;

        if (!bo_ajax_form_response_container.size())
        {
            bo_ajax_form_response_container = $('<div class="bo_ajax_form_response_container"><div class="bo_ajax_form_response_content_container">Waiting response from server... please wait...</div><p class="close_button"><button type="button" class="close_button">Close</button></p></div>').appendTo(this_form);

            $('button.close_button').bind('click', function (event)
            {
                bo_ajax_form_response_container.hide();

                if (bo_ajax_form_response_content_container.find('.success_message').size())
                {
                    this_form.find('input[type=text]').val('');
                    this_form.find('input[type=file]').val('');
                }

                bo_ajax_form_response_content_container.get(0).innerHTML = '';
            });

            bo_ajax_form_response_content_container = bo_ajax_form_response_container.find('div.bo_ajax_form_response_content_container');
        }
        else
        {
            bo_ajax_form_response_content_container = bo_ajax_form_response_container.find('div.bo_ajax_form_response_content_container');
            bo_ajax_form_response_content_container.get(0).innerHTML = 'Waiting response from server... please wait...';
            bo_ajax_form_response_container.show();
        }

        $.ajax({
            type: 'POST',
            url: this_form.attr('action'),
            data: getFormParams(this)+'&ajax_only=1',
            success: function(response)
            {
                bo_ajax_form_response_content_container.html(response);
            },
            error: function(xmlhttp)
            {
                if (xmlhttp.status)
                {
                    var error_message = '';
                    if (typeof xmlhttp.status !== 'undefined' && xmlhttp.status !== 200)
                    {
                        error_message = ' (status: '+xmlhttp.status+')';
                    }
                    else if (xmlhttp.responseText)
                    {
                        error_message = ' (response: '+xmlhttp.responseText+')';
                    }

                    bo_ajax_form_response_content_container.html(error_message);
                }
                else
                {
                    bo_ajax_form_response_content_container.html('unknown error');
                }
            },
            dataType: 'html'
        });
    });

    var bo_form_with_files = $('form.bo_form_with_files');
    var jquery_formresponse_container = bo_form_with_files.find('div.bo_ajax_form_response_container');
    var jquery_formresponse_content_container = null;

    var ajax_form_options = {
        resetForm: true,
        beforeSubmit: function () {
            // confirmation box
            if (!confirm('Are you sure you want to continue?'))
            {
                return false;
            }

            // append hidden field ajax_only to indicate submitted from ajax
            var ajax_only  = bo_form_with_files.find('input#ajax_only');
            if (!ajax_only.size())
            {
                bo_form_with_files.append('<input type="hidden" name="ajax_only" value="1">');
            }
            else
            {
                ajax_only.val(1);
            }

            // create response div on the fly
            if (!jquery_formresponse_container.size())
            {
                jquery_formresponse_container = $('<div class="bo_ajax_form_response_container"><div class="bo_ajax_form_response_content_container">Waiting response from server... please wait...</div><p class="close_button"><button type="button" class="close_button">Close</button></p></div>').appendTo(bo_form_with_files);

                $('button.close_button').bind('click', function (event)
                {
                    jquery_formresponse_container.hide();
                });

                jquery_formresponse_content_container = jquery_formresponse_container.find('div.bo_ajax_form_response_content_container');
            }
            else
            {
                jquery_formresponse_content_container = jquery_formresponse_container.find('div.bo_ajax_form_response_content_container');
                jquery_formresponse_content_container.get(0).innerHTML = 'Waiting response from server... please wait...';
                jquery_formresponse_container.show();
            }
        },
        success: function (response){
            jquery_formresponse_content_container.html(response);
        }
    };

    bo_form_with_files.ajaxForm(ajax_form_options);

    var jumpToDropDownList = $('#jumpToSelect');
    if (jumpToDropDownList)
    {
        jumpToDropDownList.change(function()
        {
           $('#jumpToClient').attr('action', $('#jumpToSelect :selected').val());
        });
    }
});

$(function() {
    $('#bulkadd_exposures').submit(function() {
        var form = $(this);

        var token_error = form.find('p.token');
        var loginids_error = form.find('p.loginids');
        var has_error = 0;

        if (form.find('#token').val().length !== 32) {
            if (!token_error.size()) {
                form.append($('<p>').addClas('errorfield token').text('Token field must be 32 chars in length.'));
            }
            has_error = 1;
        }
        else {
            token_error.remove();
        }

        if (form.find('#loginids').val().length === 0) {
            if (!loginids_error.size()) {
                form.append($('<p>').addClas('errorfield loginids').text('Some loginids must be given.'));
            }
            has_error = 1;
        }
        else {
            loginids_error.remove();
        }

        if (has_error) {
            return false;
        }
    });
});

$(function() {
    $('div.tooltip p').hide();
    $('div.tooltip').click(function() {
        var div = $(this);
        div.find('p').toggle('slow');
        return false;
    });
});
