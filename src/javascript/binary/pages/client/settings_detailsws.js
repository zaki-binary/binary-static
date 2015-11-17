var SettingsDetailsWS = (function(){
    "use strict";

    var formID = '#frmPersonalDetails';
    var frmBtn = formID + ' button',
        RealAccElements = '.RealAcc',
        errorClass = 'errorfield';
    var fieldIDs = {
        address1 : '#Address1',
        address2 : '#Address2',
        city     : '#City',
        state    : '#State',
        postcode : '#Postcode',
        phone    : '#Phone'
    };
    var isValid;


    var init = function(){
        BinarySocket.send({"get_settings": "1"});
    };


    var getDetails = function(response){
        var data = response.get_settings;

        // Check if it is a real account or not
        var isReal = !(/VRT/.test($.cookie('loginid')));

        $('#lblCountry').text(data.country);
        $('#lblEmail').text(data.email);

        if(!isReal){ // Virtual Account
            $(RealAccElements).remove();
        } 
        else { // Real Account
            BinarySocket.send({"authorize": $.cookie('login')});
            // Currently, none of APIs have the BirthDate in response
            //$('#lblBirthDate').text(data.email);
            $(fieldIDs.address1).val(data.address_line_1);
            $(fieldIDs.address2).val(data.address_line_2);
            $(fieldIDs.city).val(data.address_city);

            // Generate states list
            var residence = $.cookie('residence');
            BinarySocket.send({"states_list": residence, "passthrough": {"value": data.address_state}});
            
            $(fieldIDs.postcode).val(data.address_postcode);
            $(fieldIDs.phone).val(data.phone);

            $(RealAccElements).removeClass('hidden');

            $(frmBtn).click(function(e){
                e.preventDefault();
                e.stopPropagation();
                return setDetails();
            });
        }

    };

    var setFullName = function(response){
        $('#lblName').text(response.authorize.fullname);
    };

    var populateStates = function(response){
        $(fieldIDs.state).empty();
        var states = response.states_list;
        for(var state in states){
            $(fieldIDs.state).append($('<option/>', {value: states[state].value, text: states[state].text}));
        }
        // set Current value
        $(fieldIDs.state).val(response.echo_req.passthrough.value);
    };


    var formValidate = function(){
        clearError();
        isValid = true;

        var address1 = $(fieldIDs.address1).val(),
            address2 = $(fieldIDs.address2).val(),
            city     = $(fieldIDs.city).val(),
            state    = $(fieldIDs.state).val(),
            postcode = $(fieldIDs.postcode).val(),
            phone    = $(fieldIDs.phone).val();

        if(!(/.+/).test(address1)){
            showError(fieldIDs.address1, text.localize('Please enter the first line of your home address.'));
        }
        if(!(/.+/).test(city)){
            showError(fieldIDs.city, text.localize('Please enter a town or city.'));
        }
        if((/^.{1,3}$/).test(postcode) || !(/^.{0,20}$/).test(postcode)){
            showError(fieldIDs.postcode, text.localize('Postcode is invalid.'));
        } else if(!(/(^[\w\s-]+$)/).test(postcode)){
            showError(fieldIDs.postcode, text.localize('Please use only alphanumeric characters or spaces.'));
        }
        if(!(/^(|.{6}.*)$/).test(phone)){
            showError(fieldIDs.phone, text.localize('Invalid telephone number (too short).'));
        } else if(!(/^.{0,35}$/).test(phone)){
            showError(fieldIDs.phone, text.localize('Invalid telephone number (too long).'));
        } else if(!(/^(|\+?[0-9\s]+)$/).test(phone)){
            showError(fieldIDs.phone, text.localize('Invalid telephone number.'));
        }

        if(isValid){
            return {
                address1 : address1,
                address2 : address2,
                city     : city,
                state    : state,
                postcode : postcode,
                phone    : phone
            };
        }
        else {
            return false;
        }
    };

    var showError = function(fieldID, errMsg){
        $(fieldID).after($('<p/>', {class: errorClass, text: errMsg}));
        isValid = false;
    };

    var clearError = function(fieldID){
        $(fieldID ? fieldID : formID + ' .' + errorClass).remove();
    };


    var setDetails = function(){
        var formData = formValidate();
        if(!formData)
            return false;

        BinarySocket.send({
            "set_settings"    : 1,
            "address_line_1"  : formData.address1,
            "address_line_2"  : formData.address2,
            "address_city"    : formData.city,
            "address_state"   : formData.state,
            "address_postcode": formData.postcode,
            "phone"           : formData.phone
        });
    };

    var setDetailsResponse = function(response){
        var isError = response.set_settings !== 1;
        $('#formMessage')
            .attr('class', isError ? 'error-msg' : 'success-msg')
            .text(text.localize(isError ? 'Sorry, an error occurred while processing your account.' : 'Your settings have been updated successfully.'));
    };

    return {
        init: init,
        getDetails: getDetails,
        setDetails: setDetails,
        setDetailsResponse: setDetailsResponse,
        setFullName: setFullName,
        populateStates: populateStates
    };
}());



pjax_config_page("settings/detailsws", function(){
    return {
        onLoad: function() {
            if (!$.cookie('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }

            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        var type = response.msg_type;
                        switch(type){
                            case "get_settings":
                                SettingsDetailsWS.getDetails(response);
                                break;
                            case "set_settings":
                                SettingsDetailsWS.setDetailsResponse(response);
                                break;
                            case "authorize":
                                SettingsDetailsWS.setFullName(response);
                                break;
                            case "states_list":
                                SettingsDetailsWS.populateStates(response);
                                break;
                            case "error":
                                $('#formMessage').attr('class', 'error-msg').text(response.error.message);
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        console.log('some error occured');
                    }
                }
            });

            SettingsDetailsWS.init();
        }
    };
});
