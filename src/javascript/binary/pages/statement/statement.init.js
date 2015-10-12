function(){
    "use strict";
    function genericEventHandler(event){
        const payload = JSON.parse(event.data);
        const type = payload.msg_type;

        switch(type) {
            case "statement" : 
                StatementUI.setStatementTable(payload.statement);
                break;
            case "balance" :
                StatementUI.setStatementTableFooterBalance(payload.balance);
                break;
            case "error" :
                StatementError.wsReqErrHandler(payload);
                break;
            default:
                throw "Unhandled case " + type;
        }
    }
    
    function reloadPageOnDateSubmit(){
        const submitButton = $("#submit-date");
        submitButton.click(function(){
            var date = $("#statement-date").datepicker("getDate");
            var epoch = Math.floor(date.getTime()/1000);
            StatementData.getStatement({dt_to: epoch});
            submitButton.addClass("invisible");
        });    
    }
    
    function loadPage(){
        StatementData.getBalance();
        StatementData.getStatement();
    }
    
    function initPage(){
        StatementData.registerHandler(genericEventHandler, StatementError.genericErrHandler);
        StatementUI.setDatePickerDefault(new Date());
        StatementUI.showButtonOnDateChange();
        reloadPageOnDateSubmit();
        
        loadPage();
    }
    
    $(document).ready(function(){
        initPage();
    });
};
