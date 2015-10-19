/**
 * Created by qingwei on 19/10/2015.
 */
var ViewBalanceData = (function(){
    function getLatestBalances(){
        TradeSocket.send({balance: 1, passthrough: "popup"});
    }

    TradeSocket.init();
    return {
        getLatestBalances: getLatestBalances
    };
}());