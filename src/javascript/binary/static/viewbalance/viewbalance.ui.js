
var ViewBalanceUI = (function(){

    function updateBalances(balance){
        var bal = balance.balance;
        var currency = balance.currency;
        var view = currency.toString() + " " + bal.toString();
        $("#balance").text(view);
    }

    return {
        updateBalances: updateBalances
    };
}());
