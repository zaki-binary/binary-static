var StatementWS = (function(){
    "use strict";

    //Batch refer to number of data get from ws service per request
    //chunk refer to number of data populate to ui for each append
    //receive means receive from ws service
    //consume means consume by UI and displayed to page

    var batchSize = 100;
    var chunkSize = batchSize/2;

    var noMoreData = false;
    var currentBatch = [];
    var transactionsReceived = 0;
    var transactionsConsumed = 0;

    var tableExist = function(){
        return document.getElementById("statement-table");
    };
    var finishedConsumed = function(){
        return transactionsConsumed === transactionsReceived;
    };

    function statementHandler(response){
        var statement = response.statement;
        currentBatch = statement.transactions;
        transactionsReceived += currentBatch.length;

        if (!tableExist()) {
            StatementUI.createEmptyStatementTable().appendTo("#statement-ws-container");
            addNoticeMsg();
            StatementUI.updateStatementTable(getNextChunkStatement());
            Content.statementTranslation();
        }

        if (currentBatch.length < batchSize){
            noMoreData = true;
        }
    }

    function getNextBatchStatement(){
        StatementData.getStatement({offset: transactionsReceived, limit: batchSize});
    }

    function getNextChunkStatement(){
        var chunk = currentBatch.splice(0, chunkSize);
        transactionsConsumed += chunk.length;
        return chunk;
    }


    function loadStatementChunkWhenScroll(){
        $(document).scroll(function(){

            function hidableHeight(percentage){
                var totalHidable = $document.height() - $(window).height();
                return Math.floor(totalHidable * percentage / 100);
            }

            var $document = $(document);
            var pFromTop = $document.scrollTop();

            if (pFromTop >= hidableHeight(70)) {
                if (finishedConsumed()) {
                    if (noMoreData) {
                        $("#end-of-table").show();
                    } else {
                        getNextBatchStatement();
                    }
                } else {
                    var chunk = getNextChunkStatement();
                    if (chunk.length > 0) {
                        StatementUI.updateStatementTable(chunk);
                    }
                }
            }
        });
    }


    function initTable(){
        currentBatch = [];
        transactionsReceived = 0;
        noMoreData = false;
        transactionsConsumed = 0;
        $(".error-msg").text("");

        StatementUI.clearTableContent();
    }

    function addNoticeMsg(){
        $("<div></div>", {
            class: "notice-msg",
            id: "end-of-table",
            text: "End of the table"
        }).appendTo("#statement-ws-container");

        $("#end-of-table").hide();
    }

    function initPage(){
        getNextBatchStatement();
        loadStatementChunkWhenScroll();
    }

    function cleanStatementPageState(){
        initTable();
    }

    return {
        init: initPage,
        statementHandler: statementHandler,
        clean: cleanStatementPageState
    };
}());
