var StatementWS = (function(){
    "use strict";

    var shouldNotLoadMore = false;
    var chunkPerLoad = 10;
    var $statementDate = $("#statement-date");

    function statementHandler(statement){
        if (statement.transactions.length < chunkPerLoad) {
            StatementData.hasOlder = false;
        } else {
            StatementData.hasOlder = true;
        }
        StatementData.currentLastTransaction = statement.transactions[statement.transactions.length - 1];
        StatementUI.updateStatementTable(statement);
    }

    function getStatementForCurrentSelectedDate(){

        var fromDate = $statementDate.datepicker("getDate");
        var tillDate = $statementDate.datepicker("getDate");
        tillDate.setDate(fromDate.getDate() + 1);

        var fromEpoch = Math.floor(fromDate.getTime()/1000);
        var tillEpoch = Math.floor(tillDate.getTime()/1000);

        StatementData.getStatement({dt_to: tillEpoch, dt_fm: fromEpoch, limit: chunkPerLoad});
    }

    function getNextChunkStatement(){
        var fromDate = $statementDate.datepicker("getDate");
        var fromEpoch = Math.floor(fromDate.getTime()/1000);
        var tillEpoch = StatementData.currentLastTransaction.transaction_time;

        $(".error-msg").text("");
        StatementData.getStatement({dt_to: tillEpoch, dt_fm: fromEpoch, limit: chunkPerLoad});
    }

    function initTable(){
        shouldNotLoadMore = false;
        StatementData.hasOlder = true;
        $(".error-msg").text("");
        StatementUI.clearTableContent();
        $("#ending-note").text("Table loading...");
    }

    function loadStatementChunkWhenScroll(){
        //Attention: attach event to GLOBAL document : BAD!!
        $(document).scroll(function(){

            if (shouldNotLoadMore) {
                return;
            }

            if (!StatementData.hasOlder) {
                shouldNotLoadMore = true;
                var totalRow = $("#statement-table > tbody > tr").length;
                var currentDate = $statementDate.datepicker("getDate");
                $("#ending-note").text("You've made " + totalRow + " transaction(s) on " + moment(currentDate).format("YYYY-MM-DD"));
                return;
            }

            var $document = $(document);
            var pFromTop = $document.scrollTop();
            var totalHeight = $document.height();

            function hidableHeight(percentage){
                var totalHidable = $document.height() - $(window).height();
                return Math.floor(totalHidable * percentage / 100);
            }

            if (pFromTop >= hidableHeight(70)) {
                getNextChunkStatement();
            }
        });
    }

    function getStatementOneDayBefore(){
        var currentSelectedDate = $statementDate.datepicker("getDate");
        var oneDayBefore = $statementDate.datepicker("getDate");
        oneDayBefore.setDate(currentSelectedDate.getDate() - 1);

        $statementDate.datepicker("setDate", oneDayBefore);
        getStatementForCurrentSelectedDate();
    }

    function getStatementOneDayAfter(){
        var currentSelectedDate = $statementDate.datepicker("getDate");
        var oneDayAfter = $statementDate.datepicker("getDate");
        oneDayAfter.setDate(currentSelectedDate.getDate() + 1);

        $statementDate.datepicker("setDate", oneDayAfter);
        getStatementForCurrentSelectedDate();
    }

    function initPage(){
        StatementUI.setDatePickerDefault(new Date());
        StatementUI.showButtonOnDateChange();

        $("#submit-date").click(function(){
            initTable();
            getStatementForCurrentSelectedDate();
            submitButton.addClass("invisible");
        });
        $("#older-date").click(function(){
            initTable();
            getStatementOneDayBefore();
        });
        $("#newer-date").click(function(){
            initTable();
            getStatementOneDayAfter();
        });

        StatementUI.createEmptyStatementTable().appendTo("#statement-ws-container");
        $("<div></div>", {
            id: "ending-note",
            text: "Table loading..."
        }).appendTo("#statement-ws-container");

        getStatementForCurrentSelectedDate();
        loadStatementChunkWhenScroll();
    }
    
    return {
        init: initPage,
        statementHandler: statementHandler
    };
}());
