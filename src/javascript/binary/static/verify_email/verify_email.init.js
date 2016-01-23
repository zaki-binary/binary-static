var VerifyEmailWS = (function(){
    "use strict";

    function emailHandler(msg) {
      msg.textContent = Content.localize().textEmailSent;
      $('#email').hide();
      $('#btn-verify-email').hide();
      msg.style.display = 'inline-block';
    }

    return {
      emailHandler: emailHandler
    };
}());
