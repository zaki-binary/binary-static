
var ViewBalanceUI = (function(){
    var colsName = ["loginid", "currency", "balance"];

    function createEmptyBalanceTable(){
        var header = [
            Content.localize().textLoginID,
            Content.localize().textCurrency,
            Content.localize().textBalance
        ];
        var metadata = {
            cols: colsName,
            id: "bal-table"
        };
        var data = [];
        var $table = Table.createFlexTable(data, metadata, header);

        return $table;
    }

    function createBalancePopup(){
        var $popupDiv = $("<div></div>", {class: "popup-div", id: "balance-container"});
        var $balTitle = $("<h1></h1>", {text: Content.localize().textBalances});
        var $table = createEmptyBalanceTable();

        var $span = $("<span></span>", {class: "button"});
        var $button = $("<button></button>", {
            class: "button",
            id: "close-balances",
            text:Content.localize().textContinueTrading
        });
        $span.append($button);

        $popupDiv.append($balTitle).append($table).append($span);

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
