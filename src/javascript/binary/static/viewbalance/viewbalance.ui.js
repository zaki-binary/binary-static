/**
 * Created by qingwei on 19/10/2015.
 */
var ViewBalanceUI = (function(){
    var colsName = ["loginid", "currency", "balance"];
    function createEmptyBalanceTable(){
        var header = ["Login ID", "Currency", "Balance"];
        var metadata = {
            cols: colsName,
            id: "bal-table"
        };
        var data = [];
        var $table = DomTable.createFlexTable(data, metadata, header);

        return $table;
    }

    function createBalancePopup(){
        var $popupDiv = $("<div></div>", {class: "popup-div", id: "balance-container"});
        var $balTitle = $("<h1>Balances</h1>");
        var $table = createEmptyBalanceTable();
        var $button = $("<button></button>", {class: "button", id: "close-balances", text:"Continue Trading"});

        $popupDiv.append($balTitle).append($table).append($button);

        return $popupDiv;
    }

    function updateBalances(balances){
        $("#bal-table > tbody").children().remove("tr");

        var data = balances.map(function(bal){
            return [bal.loginid, bal.currency, bal.balance];
        });

        data.map(function(row){
            var $tr = DomTable.createFlexTableRow(row, colsName, "data");
            $("#bal-table").children("tbody").append($tr);
        });
    }

    return {
        createBalancePopup: createBalancePopup,
        updateBalances: updateBalances
    };
}());
