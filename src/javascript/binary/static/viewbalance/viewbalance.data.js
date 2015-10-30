
var ViewBalanceData = (function(){
    function getLatestBalances(){
        TradeSocket.send({balance: 1, passthrough: {purpose: "balance_popup"}});
    }
    return {
        getLatestBalances: getLatestBalances
    };
}());