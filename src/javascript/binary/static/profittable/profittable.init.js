
var ProfitTableWS = (function () {
    var chunkPerLoad = 10;
    var tableCreated = false;

    var shouldNotLoadMore = false;
    var transactionsCurrentDate = [];
    var dataLoaded = false;

    function hideIsLoading() {
        $("#overlay_background").hide();
        $("#loading_in_progress").hide();
    }

    function showIsLoading(){
        $("#overlay_background").show();
        $("#loading_in_progress").show();
    }

    function initTable(){
        transactionsCurrentDate = [];
        dataLoaded = false;
        shouldNotLoadMore = false;
        $(".error-msg").text("");

        if (tableCreated) {
            ProfitTableUI.cleanTableContent();
        }

        window.setTimeout(function(){
            if (dataLoaded) {
                return;
            }
            showIsLoading();
            $("#end-of-table").hide();
        }, 300);
    }

    function profitTableHandler(response){
        if (!tableCreated){
            ProfitTableUI.createEmptyTable().appendTo("#profit-table-ws-container");

            $("<div></div>", {
                id: "ending-note",
                class: "notice-msg",
                text: "End of the table"
            }).appendTo("#profit-table-ws-container");
            $("#ending-note").hide();
            tableCreated = true;
        }

        var profitTable = response.profit_table;

        dataLoaded = true;
        transactionsCurrentDate = profitTable.transactions;

        var firstChunk = getNextChunk();

        ProfitTableUI.updateProfitTable(firstChunk);

        if (firstChunk.length < chunkPerLoad) {
            shouldNotLoadMore = true;
            $("#ending-note").show();
        }

        hideIsLoading();
        Content.profitTableTranslation();
    }

    function getCurrentSelectedDate() {
        return moment.utc($("#profit-table-date").val());
    }

    function getProfitTableForCurrentSelectedDate(){
        var from = getCurrentSelectedDate();
        var till = moment(from);

        var fromEpoch = from.unix();
        var tillEpoch = till.unix();

        ProfitTableData.getProfitTable({date_to: tillEpoch, date_from: fromEpoch});
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

    function limitDateSelection(){
        var selectedDate = getCurrentSelectedDate();
        if (selectedDate.isSame(moment.utc(), "day") || selectedDate.isAfter(moment.utc(), "day")) {
            $("#newer-date").hide();
        } else {
            $("#newer-date").show();
        }
    }

    function init(){
        showIsLoading();
        ProfitTableUI.initDatepicker(moment.utc());

        $("#profit-table-date").on("change", function() {
            $("#submit-date").removeClass("invisible");
        });

        $("#submit-date").click(function(){
            initTable();
            getProfitTableForCurrentSelectedDate();
            $("#submit-date").addClass("invisible");
            limitDateSelection();
        });

        $("#older-date").click(function(){
            initTable();
            getProfitTableOneDayBefore();
            limitDateSelection();
        });

        $("#newer-date").click(function(){
            initTable();
            getProfitTableOneDayAfter();
            limitDateSelection();
        });

        initTable();
        getProfitTableForCurrentSelectedDate();

        onScrollLoad();
    }

    return {
        profitTableHandler: profitTableHandler,
        init: init,
        clean: initTable
    };
}());
