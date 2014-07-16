//
//
//
// This script contains various functions used by our forms.
// NOTE: Since you might not find reference to these functions within our javascripts you might delete some stuff from here without cleaning up forms.
//
function clearInputErrorField(id) {
    var errorfield = document.getElementById(id);
    if (errorfield) {
        // we need to create a brand new passage element and replace to the existing one.
        // IE6 does not treat null/empty string as empty innerHTML (which means it will appear at the IE browswer)
        var parentNode = errorfield.parentNode;
        if (parentNode) {
            var passage = document.createElement('p');
            passage.id = errorfield.id;
            passage.className = errorfield.className;
            parentNode.replaceChild(passage, errorfield);
            return passage;
        }
        return errorfield;
    }
}

function set_account_broker_code()
{
    // for auth account, we do not reset the broker
    var actype = $('#actype');
    if (actype && (actype.attr('value') == 'authaccount' || actype.attr('value') == 'virtual'))
    {
        return false;
    }

    var residence = $('#residence');
    if (residence.length)
    {
        var broker_code;
        var linkfrom = document.getElementById('linkfrom');

        var regexp_affiliate = new RegExp('^\\D+\\d+$');
        if (linkfrom && regexp_affiliate.test(linkfrom.value))
        {
            linkfrom.value = linkfrom.value.replace(/\s+/g,'');

            var grep_affiliate = new RegExp('^\\D+');
            broker_code = grep_affiliate.exec(linkfrom.value);
        }
        else
        {
            //get the broker value from the selection residence's option
            broker_code = $('#residence').find('option:selected').attr('class');
        }

        // after we get the broker code correctly then we assign the open account server and the hidden broker value
        var form_object = $('#openAccForm');

        // returned error message and redirect client back to account opening form page if there is connection error
        if (form_object.length && broker_code !== '')
        {
            var hidden_broker = $('#broker');
            hidden_broker.attr('value', broker_code);
        }
    }
}

function swithTabIfError(IsErrorFound)
{
    if (IsErrorFound)
    {
        $('.errorfield').each(function ()
        {
            if (this.innerHTML.length > 0)
            {
                MenuContent.trigger({
                    'content_id': $(this).parents('[id*=-content]').attr('id')
                });
            }
        });
        return 1;
    }
    else
    {
        return 0;
    }
}

