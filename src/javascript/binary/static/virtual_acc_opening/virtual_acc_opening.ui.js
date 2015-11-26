var VirtualAccOpeningUI = (function(){
    "use strict";

    function setLabel(details, email, password, rPassword, residence, token, btn_submit){

        var labels = document.getElementsByTagName('LABEL');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor !== '') {
                var elem = document.getElementById(labels[i].htmlFor);
                if (elem)
                    elem.label = labels[i];         
            }
        }

        details.textContent = StringUtil.toTitleCase(Content.localize().textDetails);
        email.label.innerHTML = StringUtil.toTitleCase(Content.localize().textEmailAddress);
        password.label.innerHTML = StringUtil.toTitleCase(Content.localize().textPassword);
        rPassword.label.innerHTML = StringUtil.toTitleCase(Content.localize().textRepeatPassword);
        residence.label.innerHTML = StringUtil.toTitleCase(Content.localize().textResidence);
        token.label.innerHTML = StringUtil.toTitleCase(Content.localize().textToken);
        btn_submit.textContent = StringUtil.toTitleCase(Content.localize().textCreateNewAccount);
    }

    function checkErrors(password, rPassword){
        var errorPassword = document.getElementById('error-password'),
            errorRPassword = document.getElementById('error-r-password');

        return Validate.errorMessagePassword(password.value, rPassword.value, errorPassword, errorRPassword);
    }

    return {
        setLabel: setLabel,
        checkErrors: checkErrors
    };
}());
