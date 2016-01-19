var VirtualAccOpeningData = (function(){
    "use strict";

    function getDetails(email, password, residence){
        var req = {
                    new_account_virtual: 1,
                    email: email,
                    client_password: password,
                    residence: residence,
                    verification_code: $.cookie('verify_token')
                };

        if ($.cookie('affiliate_token')) {
            req.affiliate_token = $.cookie('affiliate_token');
        }

        BinarySocket.send(req);
    }

    return {
        getDetails: getDetails
    };
}());
