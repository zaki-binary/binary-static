pjax_config_page("virtualws", function(){
	
	return {
		onLoad: function() {
        	get_residence_list();
        	Content.populate();

			var form = document.getElementById('virtual-form');
			var errorToken = document.getElementById('error-token');

		    VirtualAccOpeningUI.setLabel();

			if (form) {

				$('#virtual-form').submit( function(evt) {
					evt.preventDefault();
					Validate.hideErrorMessage(errorToken);

					var email = document.getElementById('email').value,
				    	token = document.getElementById('token').value,
				    	residence = document.getElementById('residence').value,
				    	password = document.getElementById('password').value,
						rPassword = document.getElementById('r-password').value;

					if (VirtualAccOpeningUI.checkPassword(password, rPassword)) {
						
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
					                		} else if (/email address is unverified/.test(error.message)) {
					                			errorToken.textContent = Content.errorMessage('valid', Content.localize().textToken);
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

					    VirtualAccOpeningWS.init(email, password, residence, token);
					}
					
				});
			}
		}
	};
});
