if(document.getElementById('virtual-acc-form')) {
	console.log('inside');
    
    document.getElementById('virtual-acc-form').addEventListener('click', function(evt){
    	evt.preventDefault();
    	console.log('hello');
    	var email = document.getElementById('email');
    	var error = document.getElementById('error-message');
    	if(email === "") {
    		error.textContent = 'Please fill the required field.';
    		error.setAttribute('style', 'display:block');
    	}
    });

    BinarySocket.init({
        onmessage: function(msg){
            var response = JSON.parse(msg.data);

            if (response) {
                var type = response.msg_type;
                if (type === 'verify_email'){
                    console.log('bye');
                }
            }
        }
    });
}
        