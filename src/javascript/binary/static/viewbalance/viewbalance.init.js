
var ViewBalance = (function () {
    var initialized = false;

    function init(){
        if (initialized) {
            return;
        }
        Content.populate();
        initialized = true;
        ViewBalanceData.subscribeToBalanceStream(ViewBalanceUI.updateBalances);
    }

    return {
        init: init
    };
}());