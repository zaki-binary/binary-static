pjax_config_page("virtualws", function(){
	
	return {
		onLoad: function() {
        	get_residence_list();
        	Content.populate();

			var form = document.getElementById('virtual-form');
			var allError = document.getElementsByClassName('errorfield');

			var details = document.getElementById('details'),
				email = document.getElementById('email'),
				password = document.getElementById('password'),
				rPassword = document.getElementById('r-password'),
		    	residence = document.getElementById('residence'),
		    	token = document.getElementById('token'),
		    	submit = document.getElementById('submit');

		    VirtualAccOpeningUI.setLabel(details, email, password, rPassword, residence, token, submit);

			if (form) {

				$('#virtual-form').submit( function(evt) {
					evt.preventDefault();
					Validate.hideErrorMessageAll(allError);

					var errorEmail = document.getElementById('error-email'),
						errorPassword = document.getElementById('error-password'),
						errorRPassword = document.getElementById('error-r-password'),
						errorResidence = document.getElementById('error-residence'),
						errorToken = document.getElementById('error-token');

					var errorMessageEmail = Validate.errorMessageEmail(email.value, errorEmail),
						errorMessagePassword = Validate.errorMessagePassword(password.value, rPassword.value, errorPassword, errorRPassword),
						errorMessageResidence = Validate.errorMessageResidence(residence.value, errorResidence),
						errorMessageToken = Validate.errorMessageToken(token.value, errorToken);

					if (!(errorMessageEmail || errorMessagePassword || errorMessageResidence || errorMessageToken)) {
						
						BinarySocket.init({
					        onmessage: function(msg){
					            var response = JSON.parse(msg.data);

					            if (response) {
					                var type = response.msg_type;
					                var error = response.error;
					                if (type === 'new_account_virtual' && !error){
					                    form.setAttribute('action', '/login');
										form.setAttribute('method', 'POST');
										$('#virtual-form').unbind('submit');
										form.submit();
					                } else if (error.length > 0) {
					                	if (/email address is already in use/.test(error.message)) {
					                		errorToken.textContent = Content.localize().textDuplicatedEmail;
					                	} else {
				                			errorToken.textContent = Content.errorMessage('valid', Content.localize().textToken);
				                		}
				                		Validate.displayErrorMessage(errorToken);
					                }
					            }
					        }
					    });

					    VirtualAccOpeningWS.init(email.value, password.value, residence.value, token.value);
					}
					
				});
			}
		}
	};
});
