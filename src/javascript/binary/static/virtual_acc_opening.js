if(document.getElementById('virtual-acc-form')) {

    document.getElementById('btn_acc_opening').addEventListener('click', function(evt){
    	evt.preventDefault();
    	var email = document.getElementById('email');
    	var error = document.getElementsByClassName('error-message');

    	if(email.value === "") {
    		//waiting on Mohammad's branch to use his centralized error messages
    		error[0].textContent = 'Please fill the required field.';
    		error[0].setAttribute('style', 'display:block');
    	} else if(!validateEmail(email.value)) {
    		error[0].textContent = 'Please submit a valid Email address.';
    		error[0].setAttribute('style', 'display:block');
    	} else {
    		error[0].textContent = "";
    		error[0].setAttribute('style', 'display:none');
    		BinarySocket.init({
		        onmessage: function(msg){
		            var response = JSON.parse(msg.data);

		            if (response) {
		                var type = response.msg_type;
		                if (type === 'verify_email'){
		                    //wait for shuwn yuan to implemenet 1 and 0 system if email taken
		                    window.location = "";
		                }
		            }
		        }
		    });
		    VirtualAccOpeningWS.init(email.value);
    	}
    });
}
        