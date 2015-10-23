
var ProfitTableUI = (function(){
    "use strict";

    var profitTableID = "profit-table";
    var cols = ["buy-date", "ref", "contract", "buy-price", "sell-date", "sell-price", "pl"];

    function createEmptyTable(){
        function mergeRows(start, end, $row){
            var texts = $row.children().map(function (i, obj) {
                if (i >= start && i <= end) {
                    var text = obj.textContent;
                    if (i !== start) {
                        obj.remove();
                    }
                    return text;
                }
            }).toArray().join(" ");

            $row.children().eq(start).text(texts).attr("colspan", end - start + 1);
        }

        var header = ["Purchase Date", "Ref.", "Contract", "Purchase Price", "Sale Date", "Sale Price", "Profit/Loss"];
        var footer = ["Total Profit/Loss", "", "", "", "", "", ""];
        var data = [];
        var metadata = {
            cols: cols,
            id: profitTableID
        };
        var $tableContainer = DomTable.createFlexTable(data, metadata, header, footer);
        var $pltotal = $tableContainer.
            children("table").
            children("tfoot").
            children("tr").attr("id", "pl-total");

        mergeRows(0, 5, $pltotal);

        var $subTotal = DomTable.createFlexTableRow(["Intraday Profit/Loss", "", "", "", "", "", ""], cols, "header");
        $subTotal.attr("id", "pl-day-total");
        $subTotal.insertBefore($pltotal);

        mergeRows(0, 5, $subTotal);

        return $tableContainer;
    }

    function updateProfitTable(profitTable){
        //update body
        var $tbody = $("#" + profitTableID + "> tbody");
        profitTable.transactions.map(function(transaction){
            var $newRow = createProfitTableRow(transaction);
            $newRow.appendTo($tbody);
        });

        updateFooter(profitTable);
    }

    function updateFooter(profitTable){
        var subTotal = profitTable.transactions.reduce(function(previous, current){
            var buyPrice = Number(parseFloat(current["buy_price"])).toFixed(2);
            var sellPrice = Number(parseFloat(current["sell_price"])).toFixed(2);
            var pl = sellPrice - buyPrice
            return previous + pl;
        }, 0);

        var total = "Anything but total";  //TODO need api to get information

        $("#pl-day-total > .pl").text(Number(subTotal).toFixed(2));
        $("#pl-total > .pl").text(total);

        $("#pl-day-total > .buy-date").text("Intra-day Profit/Loss");
        $("#pl-total > .buy-date").text("Total Profit/Loss");

        var subTotalType = (subTotal >= 0 ) ? "profit" : "loss";
        var totalType = (total >= 0 ) ? "profit" : "loss";

        $("#pl-day-total > .pl").removeClass("profit").removeClass("loss");
        $("#pl-total > .pl").removeClass("profit").removeClass("loss");

        $("#pl-day-total > .pl").addClass(subTotalType);
        $("#pl-total > .pl").addClass(totalType);
    }

    function createProfitTableRow(transaction){
        var buyDate = transaction["purchase_time"].replace(/\s/g, "\n");
        var ref = transaction["transaction_id"];
        var contract = transaction["longcode"];
        var buyPrice = Number(parseFloat(transaction["buy_price"])).toFixed(2);
        var sellDate = transaction["sell_time"].replace(/\s/g, "\n");
        var sellPrice = Number(parseFloat(transaction["sell_price"])).toFixed(2);
        var pl = sellPrice - buyPrice;

        var plType = (pl >= 0) ? "profit" : "loss";

        var data = [buyDate, ref, contract, buyPrice, sellDate, sellPrice, pl];
        var $row = DomTable.createFlexTableRow(data, cols, "data");

        $row.children(".buy-date").addClass("break-line");
        $row.children(".pl").addClass(plType);

        return $row;
    }

    function setDatepicker(date){
        var utcMoment = moment.utc(date).format("YYYY-MM-DD").toString();

        if (!Modernizr.inputtypes.date) {
            var utcDate = Date.parse(utcMoment);
            $('input[type=date]').datepicker({dateFormat: 'yy-mm-dd'}).datepicker("setDate", utcDate);

            return;
        }

        $("#profit-table-date").val(utcMoment);
    }

    function clearTableContent(){
        var $tbody = $("#" + profitTableID + "> tbody");
        $tbody.children("tr").remove();

        $("tfoot > tr > th").text(" ");
    }

    return {
        createEmptyTable: createEmptyTable,
        updateProfitTable: updateProfitTable,
        setDatepicker: setDatepicker,
        cleanTableContent: clearTableContent
    };
}());