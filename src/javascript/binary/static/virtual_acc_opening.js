pjax_config_page("virtualws", function(){
	
	return {
		onLoad: function() {
        	get_residence_list();

			var form = document.getElementById('virtual-form');
			if (form) {

				$('#virtual-form').submit(function(evt){
					evt.preventDefault();

					if (form.checkValidity()) {
						var error = document.getElementsByClassName('error-message')[0];
						var password = document.getElementById('password').value;
						var rPassword = document.getElementById('r-password').value;
				
						if (VirtualAccOpeningUI.checkPassword(password, rPassword)) {
							BinarySocket.init({
						        onmessage: function(msg){
						            var response = JSON.parse(msg.data);

						            if (response) {
						                var type = response.msg_type;
						                if (type === 'new_account_virtual'){
						                    form.setAttribute('action', '/login');
											form.setAttribute('method', 'POST');
											$('#virtual-form').unbind('submit');
											form.submit();
						                }
						            }
						        }
						    });
						    var email = document.getElementById('email').value;
						    var residence = document.getElementById('residence').value;
						    var token = document.getElementById('token').value;
						    
						    VirtualAccOpeningWS.init(email, password, residence, token);
						}
					}
				});
			}
		}
	};
});
