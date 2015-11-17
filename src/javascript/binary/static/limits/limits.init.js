var LimitsWS = (function(){
    "use strict";

    var tableExist = function(){
        return document.getElementById("client-limits");
    };

    function limitsHandler(response){
        var limits = response.limits;

        if (!tableExist()) {
            LimitsUI.createEmptyLimitsTable().appendTo("#limits-ws-container");
            Content.limitsTranslation();
            LimitsUI.createLimitsRow(limits);
        }
    }

    function initTable(){
        $(".error-msg").text("");
        LimitsUI.clearTableContent();
    }

    return {
        LimitsHandler: LimitsHandler,
        clean: initTable
    };
});