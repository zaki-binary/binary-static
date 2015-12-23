pjax_config_page("virtualws", function(){
  return {
    onLoad: function() {
      get_residence_list();
      Content.populate();
      VirtualAccOpeningUI.setLabel();
      var form = document.getElementById('virtual-form');
      var errorEmail = document.getElementById('error-email'),
          errorPassword = document.getElementById('error-password'),
          tooltipPassword = document.getElementById('tooltip-password');

      $('#password').on('input', function() {
        $('#password-meter').attr('value', testPassword($('#password').val())[0]);
      });

      if (form) {
        $('#virtual-form').submit( function(evt) {
          evt.preventDefault();
          Validate.hideErrorMessage(errorEmail);

          var email = document.getElementById('email').value,
              residence = document.getElementById('residence').value,
              password = document.getElementById('password').value,
              rPassword = document.getElementById('r-password').value;

          if (VirtualAccOpeningUI.checkPassword(password, rPassword)){
            if (testPassword(password)[0] >= 30) {
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
                    } else if (type === 'error' || error){
                      if (/email address is already in use/.test(error.message)) {
                        errorEmail.textContent = Content.localize().textDuplicatedEmail;
                      } else if (/verification_code/.test(error.message)) {
                        errorEmail.textContent = Content.localize().textTokenMissing;
                      } else {
                        errorEmail.textContent = Content.errorMessage('valid', Content.localize().textEmailAddress);
                      }
                      Validate.displayErrorMessage(errorEmail);
                    }
                  }
                }
              });
              VirtualAccOpeningData.getDetails(email, password, residence);
            } else if (testPassword(password)[0] < 30) {
              tooltipPassword.innerHTML = testPassword(password)[1];
              tooltipPassword.setAttribute('title', text.localize('Try adding upper and lower letters, special characters, and numbers.'))
              errorPassword.setAttribute('style', 'display:block');
            }
          }
        });
      }
    }
  };
});
