var VirtualAccOpeningUI = (function(){
    "use strict";
    
    function checkPassword(password, rPassword) {
        var error = document.getElementsByClassName('error-message')[0];
        if (!/^.+$/.test(password)) {
            error.setAttribute('style', 'display:block');
            error.textContent = 'Please enter a password.';

            return false;
        } else if (password !== rPassword) {
            error.setAttribute('style', 'display:block');
            error.textContent = 'The two passwords that you entered do not match.';

            return false;
        } else if (!/^[^-~\s]+$/.test(password)) { 
            error.setAttribute('style', 'display:block');
            error.textContent = 'Your password contains invalid characters.';

            return false;
        } else if (password.length < 6 || password.length > 25) {
            error.setAttribute('style', 'display:block');
            error.textContent = 'Password length should be between 6 and 25 characters';

            return false;
        }
        return true;
    }

    return {
        checkPassword: checkPassword
    };
}());
