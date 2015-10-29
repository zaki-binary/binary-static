/**
 * Created by qingwei on 19/10/2015.
 */
var ViewBalanceUI = (function(){
    var colsName = ["loginid", "currency", "balance"];
    var header = ["Login ID", "Currency", "Balance"];

    function createEmptyBalanceTable(){
        var metadata = {
            cols: colsName,
            id: "bal-table"
        };
        var data = [];
        var localizedHeader = header.map(function (h){
            return text.localize(h);
        });
        var $table = Table.createFlexTable(data, metadata, localizedHeader);

        return $table;
    }

    function createBalancePopup(){
        var $popupDiv = $("<div></div>", {class: "popup-div", id: "balance-container"});
        var $balTitle = $("<h1></h1>", {text: text.localize("Balances")});
        var $table = createEmptyBalanceTable();

        var $button = $("<button></button>", {
            class: "button",
            id: "close-balances",
            text:text.localize("Continue Trading")
        });

        $popupDiv.append($balTitle).append($table).append($button);

        return $popupDiv;
    }

    function updateBalances(balances){
        $("#bal-table > tbody").children().remove("tr");

        var data = balances.map(function(bal){
            var row = [
                bal.loginid,
                bal.currency,
                Number(parseFloat(bal.balance)).toFixed(2)
            ];
            var $tr = Table.createFlexTableRow(row, colsName, "data");
            $("#bal-table").children("tbody").append($tr);
        });
    }

    return {
        createBalancePopup: createBalancePopup,
        updateBalances: updateBalances
    };
}());
