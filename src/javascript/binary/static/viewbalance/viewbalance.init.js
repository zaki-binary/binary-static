/**
 * Created by qingwei on 19/10/2015.
 */
var ViewBalance = (function () {
    function showViewBalancePopup(){
        ViewBalanceData.getLatestBalances();
        $("#balance-container").bPopup({
            positionStyle: "fixed",
            opacity: 0.6,
            position: ["auto", "auto"]
        });
    }

    function hidePopup(){
        //depends on bpopup
        $("#balance-container").bPopup().close();
    }

    var initialized = false;
    function init(){
        if (initialized) {
            return;
        }
        initialized = true;
        $div = ViewBalanceUI.createBalancePopup();
        $div.appendTo(document.body);
        $("#view-balances").click(showViewBalancePopup);
        $("#close-balances").click(hidePopup);
    }

    return {
        init: init
    };
}());