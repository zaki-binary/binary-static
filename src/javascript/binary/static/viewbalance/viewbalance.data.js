/**
 * Created by qingwei on 19/10/2015.
 */
var ViewBalanceData = (function(){
    function getLatestBalances(){
        TradeSocket.send({balance: 1, passthrough: {purpose: "popup"}});
    }

    return {
        getLatestBalances: getLatestBalances
    };
}());