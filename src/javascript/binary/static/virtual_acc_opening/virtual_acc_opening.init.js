var VirtualAccOpeningWS = (function(){
    "use strict";

    function virtualAccOpeningHandler(response){
        
    }

    function initPage(email){
        VirtualAccOpeningData.getVirtualAccOpening(email);
    }

    return {
        virtualAccOpeningHandler: virtualAccOpeningHandler,
        init: initPage
    };
}());
