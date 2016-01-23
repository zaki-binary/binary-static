var VerifyEmailData = (function(){
    "use strict";

    function getEmail(email){
        BinarySocket.send({verify_email: email, type: 'account_opening'});
    }

    return {
        getEmail: getEmail
    };
}());
