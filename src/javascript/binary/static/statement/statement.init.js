var StatementWS = (function(){
    "use strict";

    function reloadPageOnDateSubmit(){
        var submitButton = $("#submit-date");
        submitButton.click(function(){
            var date = $("#statement-date").datepicker("getDate");
            date.setDate(date.getDate() + 1);
            var epoch = Math.floor(date.getTime()/1000);

            StatementUI.clearStatementTableBody();
            $(".error-msg").text("");

            StatementData.getStatement({dt_to: epoch});
            StatementData.getBalance();
            submitButton.addClass("invisible");
        });    
    }
    
    function loadPage(){
        StatementData.getStatement();
        StatementData.getBalance();
    }

    function initPage(){

        StatementUI.setDatePickerDefault(new Date());
        StatementUI.showButtonOnDateChange();
        reloadPageOnDateSubmit();
        
        loadPage();
    }
    
    return {init: initPage};
}());
