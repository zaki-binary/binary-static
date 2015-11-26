var Validate = (function(){

	//give DOM element of error to display
	function displayErrorMessage(error){
        error.setAttribute('style', 'display:block');
    }

    //give DOM element or error to hide
    function hideErrorMessage(error){
    	error.setAttribute('style', 'display:none');
    }

    //give error message for invalid password, needs value of password, repeat of password, and DOM element of error
    function errorMessagePassword(password, rPassword, error, rError) {
        if (!/^.+$/.test(password)) {
            hideErrorMessage(rError);
            error.textContent = Content.errorMessage('req');
            displayErrorMessage(error);

        	if (!/^.+$/.test(rPassword)) {
	            rError.textContent = Content.errorMessage('req');
	            displayErrorMessage(rError);

	            return false;

	        }
            return false;

        } else if (password !== rPassword) {
            hideErrorMessage(error);
            rError.textContent = Content.localize().textPasswordsNotMatching;
            displayErrorMessage(rError);

            return false;

        } else if (!/^[^-~\s]+$/.test(password)) {
            hideErrorMessage(rError);
            error.textContent = Content.errorMessage('valid', Content.localize().textPassword);
            displayErrorMessage(error);

            return false;

        } else if (password.length < 6 || password.length > 25) {
            hideErrorMessage(rError);
            error.textContent = Content.errorMessage('range', '6-25 ' + Content.localize().textPassword);
            displayErrorMessage(error);

            return false;

        }
		hideErrorMessage(error);
        hideErrorMessage(rError);
        return true;

    }

	return {
		displayErrorMessage: displayErrorMessage,
        hideErrorMessage: hideErrorMessage,
        errorMessagePassword: errorMessagePassword
    };
}());