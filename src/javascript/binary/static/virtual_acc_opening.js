pjax_config_page("virtualws", function(){
	
	return {
		onLoad: function() {
        	get_residence_list();
        	Content.populate();

			var form = document.getElementById('virtual-form');

			var details = document.getElementById('details'),
				email = document.getElementById('email'),
		    	token = document.getElementById('token'),
		    	btn_submit = document.getElementById('btn_submit'),
		    	residence = document.getElementById('residence'),
		    	password = document.getElementById('password'),
				rPassword = document.getElementById('r-password');

			var errorToken = document.getElementById('error-token');

		    VirtualAccOpeningUI.setLabel(details, email, password, rPassword, residence, token, btn_submit);

			if (form) {

				$('#virtual-form').submit( function(evt) {
					evt.preventDefault();
					Validate.hideErrorMessage(errorToken);

					var password = document.getElementById('password'),
						rPassword = document.getElementById('r-password');

					if (VirtualAccOpeningUI.checkErrors(password, rPassword)) {
						
						BinarySocket.init({
					        onmessage: function(msg){
					            var response = JSON.parse(msg.data);

					            if (response) {
					                var type = response.msg_type;
					                var error = response.error;

					                if (type === 'new_account_virtual'){

					                	if (error) {
					                		if (/email address is already in use/.test(error.message)) {
					                			errorToken.textContent = Content.localize().textDuplicatedEmail;
					                			Validate.displayErrorMessage(errorToken);
					                			return false;
					                		}
					                	}

					                    form.setAttribute('action', '/login');
										form.setAttribute('method', 'POST');

										$('#virtual-form').unbind('submit');
										form.submit();

					                } else if (type === 'error') {
										errorToken.textContent = Content.errorMessage('valid', Content.localize().textToken);
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
