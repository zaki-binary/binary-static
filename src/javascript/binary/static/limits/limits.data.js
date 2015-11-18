var LimitsData = (function(){
    "use strict";

    function getLimits(opts){
        var req = {get_limits: 1};
        if(opts){ 
            $.extend(true, req, opts);    
        }

        BinarySocket.send(req);
    }

    function getAuth(opts){
        var req = {get_account_status: 1};
        if(opts){ 
            $.extend(true, req, opts);    
        }

        BinarySocket.send(req);
    }

    return {
        getLimits: getLimits,
        getAuth: getAuth
    };
}());
