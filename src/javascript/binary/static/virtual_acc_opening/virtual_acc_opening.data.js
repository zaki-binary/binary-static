var VirtualAccOpeningData = (function(){
    "use strict";

    function getVirtualAccOpening(email, opts){
        var req = {verify_email: email};
        if(opts){ 
            $.extend(true, req, opts);    
        }

        BinarySocket.send(req);
    }

    return {
        getVirtualAccOpening: getVirtualAccOpening
    };
}());
