var VirtualAccOpeningWS = (function(){
    "use strict";

    function initPage(email, password, residence, token){
        VirtualAccOpeningData.getDetails(email, password, residence, token);
    }

    return {
        init: initPage
    };
}());
