var RealAccOpeningUI = (function(){
    "use strict";

    function setValues(dobdd, dobmm, dobyy){
        generateBirthDate(dobdd, dobmm, dobyy);
        generateState('address-state');
    }

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
            fname = document.getElementById('fname'),
            lname = document.getElementById('lname'),
            dobdd = document.getElementById('dobdd'),
            residence = document.getElementById('residence'),
            address = document.getElementById('address'),
            address1 = document.getElementById('address1'),
            address2 = document.getElementById('address2'),
            townCity = document.getElementById('address-town'),
            state = document.getElementById('address-state'),
            postalCode = document.getElementById('address-postcode'),
            btn_submit = document.getElementById('btn_submit');

        details.textContent = Content.localize().textDetails;
        title.label.innerHTML = Content.localize().textTitle;
        fname.label.innerHTML = Content.localize().textFirstName;
        lname.label.innerHTML = Content.localize().textLastName;
        dobdd.label.innerHTML = Content.localize().textDateOfBirth;
        residence.label.innerHTML = Content.localize().textResidence;
        address.textContent = Content.localize().textAddress;
        address1.label.innerHTML = Content.localize().textFirstLineAddress;
        address2.label.innerHTML = Content.localize().textSecondLineAddress;
        townCity.label.innerHTML = Content.localize().textTownCity;
        state.label.innerHTML = Content.localize().textProvince;
        postalCode.label.innerHTML = Content.localize().textPostalCode;
        btn_submit.textContent = StringUtil.toTitleCase(Content.localize().textOpenAccount);
    }

    function showError(error){
        $('#real-form').remove();
        document.getElementsByClassName('notice-msg')[0].innerHTML = Content.localize().textUnavailableReal;
        error.setAttribute('style', 'display:block');
    }

    return {
        setValues: setValues,
    	setLabel: setLabel,
        showError: showError
    };
})();