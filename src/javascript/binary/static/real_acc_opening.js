pjax_config_page("new_account/realws", function(){

  return {
    onLoad: function() {
      Content.populate();
      var residenceValue = $.cookie('residence');
      if (!$.cookie('login') || !residenceValue) {
          window.location.href = page.url.url_for('login');
          return;
      }
      if (page.client.is_logged_in) {
          client_form.set_virtual_email_id(page.client.email);
      }
      RealAccOpeningUI.setValues(residenceValue);

      $('#real-form').submit(function(evt) {
        evt.preventDefault();
        if (RealAccOpeningUI.checkValidity()){
          BinarySocket.init({
            onmessage: function(msg){
              var response = JSON.parse(msg.data);
              if (response) {
                var type = response.msg_type;
                var error = response.error;

                if (type === 'new_account_real' && !error){
                  var loginid = response.new_account_real.client_id;
                  var oldCookieValue = $.cookie('loginid_list');
                  $.cookie('loginid_list', loginid + ':R:E+' + oldCookieValue, {domain: document.domain.substring(3), path:'/'});
                  $.cookie('loginid', loginid, {domain: document.domain.substring(3), path:'/'});
                  var option = new Option('Real Account (' + loginid + ')', loginid);
                  document.getElementById('client_loginid').appendChild(option);
                  $('#client_loginid option[value="' + page.client.loginid + '"]').removeAttr('selected');
                  option.setAttribute('selected', 'selected');
                  var hiddenOption = document.createElement('option');
                  hiddenOption.value = 'hidden';
                  hiddenOption.setAttribute('name', 'newrealaccount');
                  document.getElementById('client_loginid').appendChild(hiddenOption);
                  $('#loginid-switch-form').submit();
                } else if (error) {
                  if (/multiple real money accounts/.test(error.message)){
                    RealAccOpeningUI.showError('duplicate');
                  } else {
                    RealAccOpeningUI.showError();
                  }
                }
              }
            }
          });
        }
      });
    }
  };
});
