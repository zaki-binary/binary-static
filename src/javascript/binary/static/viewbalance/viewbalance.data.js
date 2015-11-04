
var ViewBalanceData = (function(){
    function getLatestBalances(){
        TradeSocket.send({balance: 1});
    }
    return {
        getLatestBalances: getLatestBalances
    };
}());