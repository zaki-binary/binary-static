
var ViewBalance = (function () {
    var initialized = false;

    function init(){
        if (initialized) {
            return;
        }
        TradeSocket.init();
        Content.populate();
        initialized = true;
        ViewBalanceData.getLatestBalances();
    }

    return {
        init: init
    };
}());