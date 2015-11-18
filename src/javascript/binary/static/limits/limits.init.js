var LimitsWS = (function(){
    "use strict";

    function limitsHandler(response){
        var limits = response.get_limits;

        LimitsUI.fillLimitsTable(limits);
        Content.limitsTranslation();
        document.getElementById("lifetime-limit").textContent = limits["lifetime_limit"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById("already-withdraw").textContent = limits["withdrawal_since_inception_monetary"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".";
    }

    function initTable(){
        $(".error-msg").text("");
        LimitsUI.clearTableContent();
    }

    function initPage(){
        LimitsData.getLimits();
    }

    return {
        limitsHandler: limitsHandler,
        clean: initTable,
        init: initPage
    };
}());
