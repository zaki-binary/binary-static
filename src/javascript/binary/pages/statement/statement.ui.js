const StatementUI = (function(){
    "use strict";
    const $statementTable = $("#statement-table");
    const $statementTableFooter = $("#statement-table-footer");
    const $datePickerWidget = $("#statement-date");
    
    function setStatementTable(statementData){
        clearStatementTable();
        
        const transactions = statementData.transactions;
        appendTransactionsToTable(transactions, $statementTable);

        const creditTotal = transactions.reduce(function(previousValue, currentValue){
            return previousValue + parseFloat(currentValue.amount);
        }, 0);

        $statementTableFooter
            .children(".date-col-item")
            .text(moment.utc().format("YYYY-MM-DD"));
        
        $statementTableFooter
            .children(".credit-col-item")
            .text(creditTotal);
    }    
    function setStatementTableFooterBalance(balance){
        $statementTableFooter
            .children(".bal-col-item")
            .text(balance[0].balance);
    }
    function clearStatementTable(){
        $statementTable
            .children()
            .not(".header").not(".footer")
            .remove();
    };
    function appendTransactionsToTable(transactions, $tableDOM){

        for (var i = 0 ; i < transactions.length ; i ++) {
            const rowDOM = generateTransactionDOM(transactions[i]);
            rowDOM.insertBefore($statementTableFooter);
        }
    }
    function generateTransactionDOM(transaction){
        const $rowDom = $("<div></div>", {class: "flex-table-row"});

        const dateObj = new Date(transaction["transaction_time"] * 1000);
        const momentObj = moment(dateObj);
        const dateStr = momentObj.format("YYYY-MM-DD");
        const timeStr = momentObj.format("HH:mm:ss");

        const ref = transaction["transaction_id"];

        const action = transaction["action_type"];

        const desc = transaction["description"];

        const amount = transaction["amount"];
        const creditDebitType = (parseInt(amount) < 0) ? "credit" : "debit";

        const balance = transaction["balance_after"];

        const dateDom = $("<div></div>", {
            class: "flex-table-row-item breakline date-col-item",
            text: dateStr + "\n" + timeStr
        }).appendTo($rowDom);

        const refDom = $("<div></div>", {
            class: "flex-table-row-item ref-col-item",
            text: ref
        }).appendTo($rowDom);

        const actionDom = $("<div></div>", {
            class: "flex-table-row-item action-col-item",
            text: action
        }).appendTo($rowDom);

        const descDom = $("<div></div>", {
            class: "flex-table-row-item desc-col-item",
            text: desc
        }).appendTo($rowDom);

        const creditDebitDom = $("<div></div>", {
            class: "flex-table-row-item credit-col-item" + creditDebitType,
            text: amount
        }).appendTo($rowDom);

        const balanceDom = $("<div></div>", {
            class: "flex-table-row-item bal-col-item",
            text: balance
        }).appendTo($rowDom);

        return $rowDom;
    }
    function datepickerDefault(date){
        const utcMoment = moment.utc(date).format("MM/DD/YYYY");

        $(".has-date-picker").
            datepicker({defaultDate: utcMoment}).
            datepicker("setDate", utcMoment);
    }
    function showButtonOnDateChange(){
        $datePickerWidget.on("change", function() {
            $("#submit-date").removeClass("invisible");
        });
    }
    
    const publicMethods = {
        setStatementTable: setStatementTable,
        setDatePickerDefault: datepickerDefault,
        showButtonOnDateChange: showButtonOnDateChange,
        setStatementTableFooterBalance: setStatementTableFooterBalance,
        clearStatementTable: clearStatementTable
    }
    
    return publicMethods;
}());
