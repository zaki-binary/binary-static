var Validate = (function(){

	//give DOM element of error to display
	function displayErrorMessage(error){
        error.setAttribute('style', 'display:block');
    }

    //give DOM element or error to hide
    function hideErrorMessage(error){
    	error.setAttribute('style', 'display:none');
    }

    //hide all error messages based on DOM class
    function hideErrorMessageAll(allError){
    	for (var i = 0; i < allError.length; i++) {
    		allError[i].setAttribute('style', 'display:none');
    		allError[i].textContent = "";
    	}
    }

	//check validity of email
	function validateEmail(mail) {

    	if (/^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
        
        	return true;
    	}  
    	
    	return false;
	}
		
	//give error message for invalid email, needs DOM element of error and value of email
	function errorMessageEmail(email, error) {
		if (email === "") {
    		error.textContent = Content.errorMessage('req');
    		displayErrorMessage(error);
    		return true;

    	} else if (!validateEmail(email)) {
    		error.textContent = Content.errorMessage('valid', Content.localize().textEmailAddress);
    		displayErrorMessage(error);
    		return true;

    	}
    	hideErrorMessage(error);
    	return false;
    }

    //give error message for invalid password, needs value of password, repeat of password, and DOM element of error
    function errorMessagePassword(password, rPassword, error, rError) {
        if (!/^.+$/.test(password)) {
            error.textContent = Content.errorMessage('req');
            displayErrorMessage(error);

        	if (!/^.+$/.test(rPassword)) {
	            rError.textContent = Content.errorMessage('req');
	            displayErrorMessage(rError);

	            return true;

	        }
            return true;

        } else if (password !== rPassword) {
            rError.textContent = Content.localize().textPasswordsNotMatching;
            displayErrorMessage(rError);

            return true;

        } else if (!/^[^-~\s]+$/.test(password)) {
            error.textContent = Content.errorMessage('valid', Content.localize().textPassword);
            displayErrorMessage(error);

            return true;

        } else if (password.length < 6 || password.length > 25) {
            error.textContent = Content.errorMessage('range', '6-25 ' + Content.localize().textPassword);
            displayErrorMessage(error);

            return true;

        }
		hideErrorMessage(error);
        return false;

    }

    //give error message for invalid residence, needs value of residence and DOM element of error
    function errorMessageResidence(residence, error){
    	if (residence === "") {
    		error.textContent = Content.errorMessage('valid', Content.localize().textResidence);
    		displayErrorMessage(error);

    		return true;
    	}
    	hideErrorMessage(error);
    	return false;
    }

    //give error message for invalid token, needs value of token and DOM element of error
    function errorMessageToken(token, error){
    	if (token === "") {
    		error.textContent = Content.errorMessage('valid', Content.localize().textToken);
    		displayErrorMessage(error);

    		return true;
    	}
    	hideErrorMessage(error);
    	return false;
    }

	return {
		displayErrorMessage: displayErrorMessage,
		hideErrorMessageAll: hideErrorMessageAll,
		validateEmail: validateEmail,
        errorMessageEmail: errorMessageEmail,
        errorMessagePassword: errorMessagePassword,
        errorMessageResidence: errorMessageResidence,
        errorMessageToken: errorMessageToken
    };
}());