var VirtualAccOpeningUI = (function(){
    "use strict";
    
    function checkPassword(password, rPassword) {
        var error = document.getElementsByClassName('error-message')[0];
        if (!/^.+$/.test(password)) {
            error.setAttribute('style', 'display:block');
            error.textContent = Content.errorMessage('req');

            return false;

        } else if (password !== rPassword) {
            error.setAttribute('style', 'display:block');
            error.textContent = Content.localize().textPasswordsNotMatching;

            return false;

        } else if (!/^[^-~\s]+$/.test(password)) { 
            error.setAttribute('style', 'display:block');
            error.textContent = Content.errorMessage('valid', Content.localize().textPassword);

            return false;

        } else if (password.length < 6 || password.length > 25) {
            error.setAttribute('style', 'display:block');
            error.textContent = Content.errorMessage('range', '6-25 ' + Content.localize().textPassword);

            return false;

        }

        return true;

    }

    return {
        checkPassword: checkPassword
    };
}());
