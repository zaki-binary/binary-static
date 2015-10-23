var StatementUI = (function(){
    "use strict";
    var tableID = "statement-table";
    var columns = ["date", "ref", "act", "desc", "credit", "bal"];

    function datepickerDefault(date){
        var utcMoment = moment.utc(date).format("YYYY-MM-DD").toString();

        if (!Modernizr.inputtypes.date) {
            var utcDate = Date.parse(utcMoment);
            $('input[type=date]').datepicker({dateFormat: 'yy-mm-dd'}).datepicker("setDate", utcDate);

            return;
        }

        $("#statement-date").val(utcMoment);
    }
    function showButtonOnDateChange(){
        $("#statement-date").on("change", function() {
            $("#submit-date").removeClass("invisible");
        });
    }

    function createEmptyStatementTable(){
        var header = ["Date", "Ref.", "Action", "Description", "Credit/Debit", "Balance(USD)"];
        var footer = ["", "", "", "", "", ""];
        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $tableContainer = DomTable.createFlexTable(data, metadata, header, footer);

        return $tableContainer;
    }

    function clearTableContent(){
        var $tbody = $("#" + tableID + "> tbody");
        $tbody.children("tr").remove();

        $("tfoot > tr > th").text(" ");
    }

    function updateStatementTable(statement){
        var $tbody = $("#" + tableID + "> tbody");
        statement.transactions.map(function(transaction){
            var $newRow = createStatementRow(transaction);
            $newRow.appendTo($tbody);
        });

        updateStatementFooter(statement);
    }

    function updateStatementFooter(statement){
        var totalCredit = statement.transactions.reduce(function(previousValue, currentValue){
            return previousValue + parseFloat(currentValue.amount);
        }, 0);
        var totalBalance = statement.transactions[0].balance_after;

        totalCredit = Number(totalCredit).toFixed(2);
        totalBalance= Number(totalBalance).toFixed(2);

        var $footerRow = $("#" + tableID + " > tfoot").children("tr").first();
        $footerRow.children(".credit").text(totalCredit);
        $footerRow.children(".bal").text(totalBalance);
    }

    function createStatementRow(transaction){
        var dateObj = new Date(transaction["transaction_time"] * 1000);
        var momentObj = moment.utc(dateObj);
        var dateStr = momentObj.format("YYYY-MM-DD");
        var timeStr = momentObj.format("HH:mm:ss");

        var date = dateStr + "\n" + timeStr;
        var ref = transaction["transaction_id"];
        var action = CommonUtility.toTitleCase(transaction["action_type"]);
        var desc = transaction["longcode"];
        var amount = Number(parseFloat(transaction["amount"])).toFixed(2);
        var balance = Number(parseFloat(transaction["balance_after"])).toFixed(2);

        var creditDebitType = (parseInt(amount) >= 0) ? "profit" : "loss";

        var $statementRow = DomTable.createFlexTableRow([date, ref, action, desc, amount, balance], columns, "data");
        $statementRow.children(".credit").addClass(creditDebitType);
        $statementRow.children(".date").addClass("break-line");

        return $statementRow;
    }
    
    return {
        clearTableContent: clearTableContent,
        setDatePickerDefault: datepickerDefault,
        showButtonOnDateChange: showButtonOnDateChange,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable: updateStatementTable
    };
}());
