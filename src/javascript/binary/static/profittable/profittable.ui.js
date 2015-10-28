
var ProfitTableUI = (function(){
    "use strict";

    var profitTableID = "profit-table";
    var cols = ["buy-date", "ref", "contract", "buy-price", "sell-date", "sell-price", "pl"];
    var header = ["Purchase Date", "Ref.", "Contract", "Purchase Price", "Sale Date", "Sale Price", "Profit/Loss"];
    var footer = ["Intraday Profit/Loss", "", "", "", "", "", ""];

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

            $row.
                children().
                eq(start).
                text(texts).
                attr("colspan", end - start + 1);
        }

        var localizedHeader = header.map(function(t){return text.localize(t);});

        var data = [];
        var metadata = {
            cols: cols,
            id: profitTableID
        };
        var $tableContainer = Table.createFlexTable(data, metadata, header, footer);

        var $pltotal = $tableContainer.
            children("table").
            children("tfoot").
            children("tr").
            attr("id", "pl-day-total").hide();

        mergeRows(0, 5, $pltotal);

        return $tableContainer;
    }

    function updateProfitTable(transactions){
        Table.overwriteTableBody(profitTableID, transactions, createProfitTableRow);
        updateFooter(transactions);
    }

    function updateFooter(transactions){
        var subTotal = transactions.reduce(function(previous, current){
            var buyPrice = Number(parseFloat(current["buy_price"])).toFixed(2);
            var sellPrice = Number(parseFloat(current["sell_price"])).toFixed(2);
            var pl = sellPrice - buyPrice
            return previous + pl;
        }, 0);

        $("#pl-day-total > .pl").text(Number(subTotal).toFixed(2));
        $("#pl-day-total > .buy-date").text("Intra-day Profit/Loss");

        var subTotalType = (subTotal >= 0 ) ? "profit" : "loss";
        $("#pl-day-total > .pl").removeClass("profit").removeClass("loss");
        $("#pl-day-total > .pl").addClass(subTotalType);

        $("#" + profitTableID + ">tfoot").show();
    }

    function createProfitTableRow(transaction){
        var buyDate = moment.
            utc(transaction["purchase_time"] * 1000).
            locale("en").
            format("YYYY-MM-DD HH:mm:ss").replace(/\s/g, "\n");

        var sellDate = moment.
            utc(transaction["sell_time"] * 1000).
            locale("en").
            format("YYYY-MM-DD\nHH:mm:ss").replace(/\s/g, "\n");


        var ref = transaction["transaction_id"];
        var contract = transaction["longcode"];
        var buyPrice = Number(parseFloat(transaction["buy_price"])).toFixed(2);
        var sellPrice = Number(parseFloat(transaction["sell_price"])).toFixed(2);

        var pl = Number(sellPrice - buyPrice).toFixed(2);

        var plType = (pl >= 0) ? "profit" : "loss";

        var data = [buyDate, ref, contract, buyPrice, sellDate, sellPrice, pl];
        var $row = Table.createFlexTableRow(data, cols, "data");

        $row.children(".buy-date").addClass("break-line");
        $row.children(".pl").addClass(plType);

        return $row[0];
    }

    function initDatepicker(){
        DatepickerUtil.initDatepicker("profit-table-date", moment.utc(), null, 0);
    }

    function clearTableContent(){
        Table.clearTableBody(profitTableID);
        $("#" + profitTableID + ">tfoot").hide();
    }

    return {
        createEmptyTable: createEmptyTable,
        updateProfitTable: updateProfitTable,
        initDatepicker: initDatepicker,
        cleanTableContent: clearTableContent
    };
}());