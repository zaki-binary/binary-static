var VerifyEmailWS = (function(){
    "use strict";

    function initPage(email){
        VerifyEmailData.getEmail(email);
    }

    return {
        init: initPage
    };
}());
