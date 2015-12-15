var RealAccOpeningUI = (function(){
    "use strict";

    function setLabel(){
		var labels = document.getElementsByTagName('LABEL');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor !== '') {
                var elem = document.getElementById(labels[i].htmlFor);
                if (elem)
                    elem.label = labels[i];         
            }
        }

        var details = document.getElementById('details'),
            title = document.getElementById('title'),
            btn_submit = document.getElementById('btn_submit'),
            fname = document.getElementById('fname'),
            lname = document.getElementById('lname');
            /*residence = document.getElementById('residence'),
            password = document.getElementById('password'),
            rPassword = document.getElementById('r-password');*/

        details.textContent = StringUtil.toTitleCase(Content.localize().textDetails);
        title.label.innerHTML = StringUtil.toTitleCase(Content.localize().textTitle);
        fname.label.innerHTML = StringUtil.toTitleCase(Content.localize().textFirstName);
        lname.label.innerHTML = StringUtil.toTitleCase(Content.localize().textLastName);
        /*rPassword.label.innerHTML = StringUtil.toTitleCase(Content.localize().textRepeatPassword);
        residence.label.innerHTML = StringUtil.toTitleCase(Content.localize().textResidence);*/
        btn_submit.textContent = StringUtil.toTitleCase(Content.localize().textOpenAccount);
    }

    return {
    	setLabel: setLabel,
    };
})();