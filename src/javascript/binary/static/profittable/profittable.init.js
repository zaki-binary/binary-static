
var ProfitTableWS = (function () {
    var chunkPerLoad = 10;
    var shouldNotLoadMore = false;

    var transactionsCurrentDate = [];
    var dataLoaded = false;

    function initTable(){
        transactionsCurrentDate = [];
        dataLoaded = false;
        shouldNotLoadMore = false;
        ProfitTableUI.cleanTableContent();
    }

    function profitTableHandler(response){
        var profitTable = response.profit_table;

        dataLoaded = true;
        transactionsCurrentDate = profitTable.transactions;

        var firstChunk = getNextChunk();

        ProfitTableUI.updateProfitTable(firstChunk);

        if (firstChunk.length < chunkPerLoad) {
            shouldNotLoadMore = true;
            $("#ending-note").show();
        }

        $("#overlay_background").hide();
        $("#loading_in_progress").hide();
    }

    function getCurrentSelectedDate() {
        return moment.utc($("#profit-table-date").val());
    }

    function getProfitTableForCurrentSelectedDate(){
        var from = getCurrentSelectedDate();
        var till = moment(from);
        till.add(1, "d");

        var fromEpoch = from.unix();
        var tillEpoch = till.unix();

        ProfitTableData.getProfitTable({dt_to: tillEpoch, dt_fm: fromEpoch});
    }

    function getProfitTableOneDayBefore(){
        var before = getCurrentSelectedDate();
        before.subtract(1, "d");

        var beforeString = before.locale("en").format("YYYY-MM-DD").toString();

        $("#profit-table-date").val(beforeString);
        getProfitTableForCurrentSelectedDate();
    }

    function getProfitTableOneDayAfter(){
        var after = getCurrentSelectedDate();
        after.add(1, "d");

        var afterString = after.locale("en").format("YYYY-MM-DD").toString();

        $("#profit-table-date").val(afterString);
        getProfitTableForCurrentSelectedDate();
    }

    function getNextChunk(){
        return transactionsCurrentDate.splice(0, chunkPerLoad);
    }

    function onScrollLoad(){
        $(document).scroll(function(){

            if (shouldNotLoadMore || !dataLoaded) {
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
                var nextChunk = getNextChunk();
                ProfitTableUI.updateProfitTable(nextChunk);
                if (nextChunk.length < chunkPerLoad) {
                    shouldNotLoadMore = true;
                    $("#ending-note").show();
                }
            }
        });
    }

    function init(){

        var now = new Date();
        ProfitTableUI.setDatepicker(now);

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
            class: "notice-msg"
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
