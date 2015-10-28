var StatementUI = (function(){
    "use strict";
    var tableID = "statement-table";
    var columns = ["date", "ref", "act", "desc", "credit", "bal"];
    var header = ["Date", "Ref.", "Action", "Description", "Credit/Debit", "Balance("+ User.get().currency +")"];
    var footer = ["", "", "", "", "", ""];

    function createEmptyStatementTable(){
        var localizedHeader = header.map(function(t){ return text.localize(t); });
        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $tableContainer = TableCreator.createFlexTable(data, metadata, localizedHeader, footer);
        return $tableContainer;
    }

    function initDatepicker(){
        DatepickerUtil.initDatepicker(tableID, moment.utc(), null, 0);
    }
    function showButtonOnDateChange(){
        $("#statement-date").on("change", function() {
            $("#submit-date").removeClass("invisible");
        });
    }



    function clearTableContent(){
        var $tbody = $("#" + tableID + "> tbody");
        $tbody.children("tr").remove();
    }

    function updateStatementTable(transactions){
        var $tbody = $("#"+ tableID + "> tbody");

        var $docFrag = $(document.createDocumentFragment());

        transactions.map(function(transaction){
            var $newRow = createStatementRow(transaction);
            $newRow.appendTo($docFrag);
        });

        $tbody.append($docFrag);

        updateStatementFooter(transactions);
    }

    function updateStatementFooter(transactions){
        var allCredit = [].slice.call(document.querySelectorAll("td.credit"));
        allCredit = allCredit.map(function(node){return node.textContent;});

        var totalCredit = allCredit.reduce(function(p, c){return p + parseFloat(c);}, 0);

        TradeSocket.send({balance: 1, passthrough: {purpose: "statement_footer"}});

        totalCredit = Number(totalCredit).toFixed(2);

        var $footerRow = $("#" + tableID + " > tfoot").children("tr").first();
        $footerRow.children(".credit").text(totalCredit);

        var creditType = (totalCredit >= 0) ? "profit" : "loss";
        $footerRow.children(".credit").removeClass("profit").removeClass("loss");
        $footerRow.children(".credit").addClass(creditType);
    }

    function createStatementRow(transaction){
        var dateObj = new Date(transaction["transaction_time"] * 1000);
        var momentObj = moment.utc(dateObj);
        var dateStr = momentObj.format("YYYY-MM-DD");
        var timeStr = momentObj.format("HH:mm:ss");

        var date = dateStr + "\n" + timeStr;
        var ref = transaction["transaction_id"];
        var action = StringUtil.toTitleCase(transaction["action_type"]);
        var desc = transaction["longcode"];
        var amount = Number(parseFloat(transaction["amount"])).toFixed(2);
        var balance = Number(parseFloat(transaction["balance_after"])).toFixed(2);

        var creditDebitType = (parseInt(amount) >= 0) ? "profit" : "loss";

        var $statementRow = TableCreator.createFlexTableRow([date, ref, action, desc, amount, balance], columns, "data");
        $statementRow.children(".credit").addClass(creditDebitType);
        $statementRow.children(".date").addClass("break-line");

        return $statementRow;
    }
    
    return {
        clearTableContent: clearTableContent,
        setDatePickerDefault: initDatepicker,
        showButtonOnDateChange: showButtonOnDateChange,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable: updateStatementTable
    };
}());
