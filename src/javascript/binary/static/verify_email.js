//get gtm layer from ashkan before release
if(document.getElementById('btn-verify-email')) {

    document.getElementById('btn-verify-email').addEventListener('click', function(evt){
    	evt.preventDefault();
    	var email = document.getElementById('email');
    	var error = document.getElementsByClassName('error-message')[0];
        Content.populate();

    	if(email.value === "") {
    		error.textContent = Content.errorMessage('req');
    		error.setAttribute('style', 'display:block');

    	} else if(!validateEmail(email.value)) {
    		error.textContent = Content.errorMessage('valid', Content.localize().textEmailAddress + '.');
    		error.setAttribute('style', 'display:block');

    	} else {
    		error.textContent = "";
    		error.setAttribute('style', 'display:none');

    		BinarySocket.init({
		        onmessage: function(msg){
		            var response = JSON.parse(msg.data);

		            if (response) {
		                var type = response.msg_type;
		                if (type === 'verify_email'){
		                    window.location = "../new_account/virtualws";
		                }
		            }
		        }
		    });
		    VerifyEmailWS.init(email.value);
    	}
    });
}
        