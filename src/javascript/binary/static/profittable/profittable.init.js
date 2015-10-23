
var ProfitTableWS = (function () {
    var chunkPerLoad = 10;
    var hasOlder = true;
    var shouldNotLoadMore = false;

    var sentTillTime;
    var receivedOldestTime;

    function initTable(){
        hasOlder = true;
        shouldNotLoadMore = false;
        sentTillTime = undefined;
        receivedOldestTime = undefined;
        ProfitTableUI.cleanTableContent();
    }

    function profitTableHandler(response){

        var profitTable = response.profit_table;
        receivedOldestTime = moment.utc(profitTable.transactions[profitTable.transactions.length - 1].purchase_time).unix();
        ProfitTableUI.updateProfitTable(profitTable);
    }

    function getProfitTableForCurrentSelectedDate(){
        var from = moment.utc($("#profit-table-date").val());
        var till = moment.utc($("#profit-table-date").val());
        till.add(1, "d");

        var fromEpoch = from.unix();
        var tillEpoch = till.unix();


        ProfitTableData.getProfitTable({dt_to: tillEpoch, dt_fm: fromEpoch, limit: chunkPerLoad});
    }

    function getProfitTableOneDayBefore(){
        var before = moment.utc($("#profit-table-date").val());
        before.subtract(1, "d");
        before = before.format("YYYY-MM-DD").toString();

        $("#profit-table-date").val(before);
        getProfitTableForCurrentSelectedDate();
    }

    function getProfitTableOneDayAfter(){
        var after = moment.utc($("#profit-table-date").val());
        after.add(1, "d");
        after = after.format("YYYY-MM-DD").toString();

        $("#profit-table-date").val(after);
        getProfitTableForCurrentSelectedDate();
    }

    function getNextChunk(){
        var fromDate = moment.utc($("#profit-table-date").val());
        var fromEpoch = fromDate.unix();
        var tillEpoch = receivedOldestTime - 1;

        ProfitTableData.getProfitTable({dt_to: tillEpoch, dt_fm: fromEpoch, limit: chunkPerLoad});
    }

    function onScrollLoad(){
        $(document).scroll(function(){

            if (shouldNotLoadMore || !receivedOldestTime || (sentTillTime && sentTillTime === receivedOldestTime)) {
                return;
            }

            if (!hasOlder) {
                shouldNotLoadMore = true;
                var totalRow = $("#profit-table > tbody > tr").length;
                var currentDate = moment.utc($("#profit-table-date").val());
                $("#ending-note").text("You've made " + totalRow + " transaction(s) on " + currentDate.format("YYYY-MM-DD"));
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
                getNextChunk();
            }
        });
    }

    function init(){

        var now = new Date();
        $("#profit-table-date").val(moment.utc(now).format("YYYY-MM-DD"));


        $("#profit-table-date").on("change", function() {
            $("#submit-date").removeClass("invisible");
        });

        $("#submit-date").click(function(){
            getProfitTableForCurrentSelectedDate();
            $("#submit-date").addClass("invisible");
        });

        $("#older-date").click(function(){
            initTable();
            getProfitTableOneDayBefore();
        });

        $("#newer-date").click(function(){
            initTable();
            getProfitTableOneDayAfter();
        });

        ProfitTableUI.createEmptyTable().appendTo("#profit-table-ws-container");

        $("<div></div>", {
            id: "ending-note",
        }).appendTo("#profit-table-ws-container");

        getProfitTableForCurrentSelectedDate();

        onScrollLoad();
    }

    return {
        profitTableHandler: profitTableHandler,
        init: init,
        clean: initTable
    };
}());
