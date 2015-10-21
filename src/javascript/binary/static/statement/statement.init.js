var StatementWS = (function(){
    "use strict";

    var shouldNotLoadMore = false;
    var chunkPerLoad = 10;

    var sentTillTime;
    var receivedOldestTransactionTime;

    function statementHandler(response){
        var statement = response.statement;
        if (statement.transactions.length < chunkPerLoad) {
            StatementData.hasOlder = false;
        } else {
            StatementData.hasOlder = true;
        }
        receivedOldestTransactionTime = statement.transactions[statement.transactions.length - 1].transaction_time;

        StatementUI.updateStatementTable(statement);
    }

    function getCurrentSelectedDate() {
        return new Date($("#statement-date").val());
    }

    function getStatementForCurrentSelectedDate(){

        console.log("Current Selected Date is : ", getCurrentSelectedDate());

        var fromDate = getCurrentSelectedDate();
        var tillDate = getCurrentSelectedDate();
        tillDate.setDate(fromDate.getDate() + 1);

        var fromEpoch = Math.floor(fromDate.getTime()/1000);
        var tillEpoch = Math.floor(tillDate.getTime()/1000);

        StatementData.getStatement({dt_to: tillEpoch, dt_fm: fromEpoch, limit: chunkPerLoad});
    }

    function getNextChunkStatement(){
        var fromDate = getCurrentSelectedDate();
        var fromEpoch = Math.floor(fromDate.getTime()/1000);
        var tillEpoch = receivedOldestTransactionTime;

        $(".error-msg").text("");
        StatementData.getStatement({dt_to: tillEpoch, dt_fm: fromEpoch, limit: chunkPerLoad});
        sentTillTime = receivedOldestTransactionTime;
    }

    function initTable(){
        sentTillTime = undefined;
        receivedOldestTransactionTime = undefined;
        shouldNotLoadMore = false;
        StatementData.hasOlder = true;

        $(".error-msg").text("");
        StatementUI.clearTableContent();
        $("#ending-note").text("");
    }

    function loadStatementChunkWhenScroll(){
        //Attention: attach event to GLOBAL document : BAD!!
        $(document).scroll(function(){

            if (shouldNotLoadMore || !receivedOldestTransactionTime || (sentTillTime && sentTillTime === receivedOldestTransactionTime)) {
                return;
            }

            if (!StatementData.hasOlder) {
                shouldNotLoadMore = true;
                var totalRow = $("#statement-table > tbody > tr").length;
                var currentDate = getCurrentSelectedDate();
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
                $("#ending-note").text("Table loading...");
            }
        });
    }

    function getStatementOneDayBefore(){
        var currentSelectedDate = getCurrentSelectedDate();
        var oneDayBefore = getCurrentSelectedDate();
        oneDayBefore.setDate(currentSelectedDate.getDate() - 1);

        oneDayBefore = moment(oneDayBefore).format("YYYY-MM-DD").toString();

        $("#statement-date").val(oneDayBefore);
        getStatementForCurrentSelectedDate();
    }

    function getStatementOneDayAfter(){
        var currentSelectedDate = getCurrentSelectedDate();
        var oneDayAfter = getCurrentSelectedDate();
        oneDayAfter.setDate(currentSelectedDate.getDate() + 1);

        oneDayAfter = moment(oneDayAfter).format("YYYY-MM-DD").toString();

        $("#statement-date").val(oneDayAfter);
        getStatementForCurrentSelectedDate();
    }

    function initPage(){
        StatementUI.setDatePickerDefault(new Date());
        StatementUI.showButtonOnDateChange();

        $("#submit-date").click(function(){
            initTable();
            getStatementForCurrentSelectedDate();
            $("#submit-date").addClass("invisible");
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

    function cleanStatementPageState(){
        //$(document).off("scroll");
        //$("#submit-date").off("click");
        //$("#older-date").off("click");
        //$("#newer-date").off("click");
        initTable();
    }

    return {
        init: initPage,
        statementHandler: statementHandler,
        clean: cleanStatementPageState
    };
}());
