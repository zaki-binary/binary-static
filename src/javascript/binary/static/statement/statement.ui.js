var StatementUI = (function(){
    "use strict";
    var $statementTable = $("#statement-table");
    var $statementTableFooter = $("#statement-table-footer");
    var $statementTableBody = $("#statement-table-body");
    var $datePickerWidget = $("#statement-date");

    function setStatementTable(statementResponse){

        var dateReq = new Date(statementResponse.echo_req.dt_to * 1000);
        //TODO : need to check if there' newer or older and show the button accordingly

        var statementData = statementResponse.statement;

        console.info("rendering table");
        clearStatementTableBody();

        var transactions = statementData.transactions;
        appendTransactionsToTable(transactions, $statementTable);

        var creditTotal = transactions.reduce(function(previousValue, currentValue){
            return previousValue + parseFloat(currentValue.amount);
        }, 0);

        $statementTableFooter
            .children(".date-col-item")
            .text(moment.utc().format("YYYY-MM-DD"));
        
        $statementTableFooter
            .children(".credit-col-item")
            .text(Number(creditTotal).toFixed(2));

        $("#statement-table-container").floatingScroll();
        //setDescColSpan(2);
    }    
    function setStatementTableFooterBalance(balanceObj){
        var balance = Number(balanceObj[0].balance).toFixed(2);
        $statementTableFooter
            .children(".bal-col-item")
            .text(balance);
    }
    function clearStatementTableBody(){
        $statementTableFooter
            .children(".credit-col-item")
            .text("");
        $statementTableBody
            .children()
            .remove();
    }
    function appendTransactionsToTable(transactions, $tableDOM){

        for (var i = 0 ; i < transactions.length ; i ++) {
            var rowDOM = generateTransactionDOM(transactions[i]);
            rowDOM.appendTo($statementTableBody);
        }
    }
    function generateTransactionDOM(transaction){
        var $rowDom = $("<tr></tr>", {class: "flex-table-row"});

        var dateObj = new Date(transaction["transaction_time"] * 1000);
        var momentObj = moment(dateObj);
        var dateStr = momentObj.format("YYYY-MM-DD");
        var timeStr = momentObj.format("HH:mm:ss");

        var ref = transaction["transaction_id"];

        var action = transaction["action_type"];

        var desc = transaction["description"];

        var amount = Number(parseFloat(transaction["amount"])).toFixed(2);
        var creditDebitType = (parseInt(amount) >= 0) ? "profit" : "loss";

        var balance = Number(parseFloat(transaction["balance_after"])).toFixed(2);

        var dateDom = $("<td></td>", {
            class: "flex-table-row-item breakline date-col-item",
            text: dateStr + "\n" + timeStr
        }).appendTo($rowDom);

        var refDom = $("<td></td>", {
            class: "flex-table-row-item ref-col-item",
            text: ref
        }).appendTo($rowDom);

        var actionDom = $("<td></td>", {
            class: "flex-table-row-item action-col-item",
            text: action
        }).appendTo($rowDom);

        var descDom = $("<td></td>", {
            class: "flex-table-row-item desc-col-item",
            text: desc
        }).appendTo($rowDom);

        var creditDebitDom = $("<td></td>", {
            class: "flex-table-row-item credit-col-item " + creditDebitType,
            text: amount
        }).appendTo($rowDom);

        var balanceDom = $("<td></td>", {
            class: "flex-table-row-item bal-col-item",
            text: balance
        }).appendTo($rowDom);

        return $rowDom;
    }
    function datepickerDefault(date){
        var utcMoment = moment.utc(date).format("MM/DD/YYYY").toString();
        var utcDate = Date.parse(utcMoment);
        
        $(".has-date-picker").
            datepicker({defaultDate: utcDate}).
            datepicker("setDate", utcDate);
    }
    function showButtonOnDateChange(){
        $datePickerWidget.on("change", function() {
            $("#submit-date").removeClass("invisible");
        });
    }
    
    var publicMethods = {
        setStatementTable: setStatementTable,
        setDatePickerDefault: datepickerDefault,
        showButtonOnDateChange: showButtonOnDateChange,
        setStatementTableFooterBalance: setStatementTableFooterBalance,
        clearStatementTableBody: clearStatementTableBody
    };
    
    return publicMethods;
}());
