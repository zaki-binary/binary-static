var VirtualAccOpeningUI = (function(){
    "use strict";

    function setLabel(details, email, password, rPassword, residence, token, submit){

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
        submit.textContent = StringUtil.toTitleCase(Content.localize().textSubmit);
    }

    return {
        setLabel: setLabel
    };
}());
