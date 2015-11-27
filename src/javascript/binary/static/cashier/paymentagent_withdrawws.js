var PaymentAgentWithdrawWS = (function() {
    "use strict";

    var containerID = '#paymentagent_withdrawal';
    var $views      = $(containerID + ' .viewItem');
    var errorClass = 'errorfield';
    var viewIDs = {
        error   : '#viewError',
        success : '#viewSuccess',
        confirm : '#viewConfirm',
        form    : '#viewForm'
    };
    var fieldIDs = {
        ddlAgents : '#ddlAgents',
        txtAmount : '#txtAmount',
        txtDesc   : '#txtDescription'
    };
    var formData, isValid;
    var withdrawCurrency = 'USD',
        minAmount = 10,
        maxAmount = 2000;


    var init = function() {
        $views.addClass('hidden');

        if((/VRT/).test($.cookie('loginid'))) { // Virtual Account
            showPageError(text.localize('You are not authorized for withdrawal via payment agent.'));
            return false;
        }

        var residence = $.cookie('residence');
        BinarySocket.send({"paymentagent_list": residence});

        $(viewIDs.form + ' button').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            formData = formValidate();
            if(!formData) {
                return false;
            }
            else {
                withdrawRequest(true);
            }
        });
    };

    // -----------------------
    // ----- Agents List -----
    // -----------------------
    var populateAgentsList = function(response) {
        var $ddlAgents = $(fieldIDs.ddlAgents);
        $ddlAgents.empty();
        var paList = response.paymentagent_list.list;
        if(paList.length > 0) {
            insertListOption($ddlAgents, text.localize('Please select a payment agent'));
            for(var i = 0; i < paList.length; i++){
                insertListOption($ddlAgents, paList[i].name, paList[i].paymentagent_loginid);
            }
        }
        else {
            showPageError(text.localize('The Payment Agent facility is currently not available in your country.'));
        }
    };

    var insertListOption = function($ddlObject, itemText, itemValue) {
        $ddlObject.append($('<option/>', {value: itemValue, text: itemText}));
    };

    // ----------------------------
    // ----- Form Validations -----
    // ----------------------------
    var formValidate = function() {
        clearError();
        isValid = true;

        var agent  = $(fieldIDs.ddlAgents).val().trim(),
            amount = $(fieldIDs.txtAmount).val().trim(),
            desc   = $(fieldIDs.txtDesc).val().trim();
        
        var numbers = Content.localize().textNumbers;
        
        // Payment Agent
        isRequiredError(fieldIDs.ddlAgents);

        // Amount
        if(!isRequiredError(fieldIDs.txtAmount) && !(/^[0-9\.]+$/).test(amount)) {
            showError(fieldIDs.txtAmount, Content.errorMessage('reg', [numbers]));
        }
        else if(amount < minAmount) {
            showError(fieldIDs.txtAmount, text.localize('Invalid amount, minimum is') + ' ' + withdrawCurrency + ' ' + minAmount);
        }
        else if(amount > maxAmount) {
            showError(fieldIDs.txtAmount, text.localize('Invalid amount, maximum is') + ' ' + withdrawCurrency + ' ' + maxAmount);
        }

        // Description
        if(!isRequiredError(fieldIDs.txtDesc) && !(/^[a-zA-Z0-9\s\-']$/).test(desc)) {
            showError(fieldIDs.txtDesc, Content.errorMessage('reg', [letters, numbers, space, '- \'']));
        }

        if(isValid) {
            return {
                agent    : agent,
                agentname: $(fieldIDs.ddlAgents + ' option:selected').text(),
                currency : withdrawCurrency,
                amount   : amount,
                desc     : desc
            };
        }
        else {
            return false;
        }
    };

    var isRequiredError = function(fieldID) {
        if(!(/.+/).test($(fieldID).val().trim())){
            showError(fieldID, Content.errorMessage('req'));
            return true;
        } else {
            return false;
        }
    };

    var isCountError = function(fieldID, min, max) {
        var fieldValue = $(fieldID).val().trim();
        if((fieldValue.length > 0 && fieldValue.length < min) || fieldValue.length > max) {
            showError(fieldID, Content.errorMessage('range', '(' + min + '-' + max + ')'));
            return true;
        } else {
            return false;
        }
    };

    // ----------------------------
    // ----- Withdraw Process -----
    // ----------------------------
    var withdrawRequest = function(isDryRun) {
        var dry_run = isDryRun ? 1 : 0;

        BinarySocket.send({
            "paymentagent_withdraw" : 1,
            "paymentagent_loginid"  : formData.agent,
            "currency"    : formData.currency,
            "amount"      : formData.amount,
            "description" : formData.desc,
            "dry_run"     : dry_run
        });
    };

    var withdrawResponse = function(response) {
        var responseCode = response.paymentagent_withdraw;
        switch(responseCode){
            case "2": // dry_run success: showing the confirmation page
                setActiveView(views.confirm);

                $('#lblAgentName').text(formData.agentname);
                $('#lblCurrency').text(formData.currency);
                $('#lblAmount').text(formData.amount);

                $(viewIDs.confirm + ' #btnConfirm').click(function(){
                    withdrawRequest(false);
                });
                $(viewIDs.confirm + ' #btnBack').click(function(){
                    setActiveView(viewIDs.form);
                });
                break;

            case "1": // withdrawal success
                $('#formMessage').css('display', '')
                    .attr('class', 'success-msg')
                    .html(
                        '<ul class="checked"><li>' 
                        + text.localize('Your settings have been updated successfully.') 
                        + '</li></ul>'
                    );
                break;

            case "0": // error
                $('#formMessage').css('display', '')
                    .attr('class', errorClass)
                    .html(response.error.message);
                break;
        }
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    var showPageError = function(errMsg) {
        setActiveView(viewIDs.error);
        $(viewIDs.error + ' > p').html(errMsg);
    };

    var showError = function(fieldID, errMsg) {
        $(fieldID).after($('<p/>', {class: errorClass, text: errMsg}));
        isValid = false;
    };

    var clearError = function(fieldID) {
        $(fieldID ? fieldID : formID + ' .' + errorClass).remove();
    };

    // ----- View Control -----
    var setActiveView = function(viewID) {
        $views.addClass('hidden');
        $(viewID).removeClass('hidden');
    };


    return {
        init: init,
        populateAgentsList: populateAgentsList,
        withdrawResponse: withdrawResponse
    };
}());



pjax_config_page("paymentagent/withdrawws", function() {
    return {
        onLoad: function() {
            if (!$.cookie('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }

            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        var type = response.msg_type;
                        switch(type){
                            case "paymentagent_list":
                                PaymentAgentWithdrawWS.populateAgentsList(response);
                                break;
                            case "paymentagent_withdraw":
                                PaymentAgentWithdrawWS.withdrawResponse(response);
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

            Content.populate();
            PaymentAgentWithdrawWS.init();
        }
    };
});
