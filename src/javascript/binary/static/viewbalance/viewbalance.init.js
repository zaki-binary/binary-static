/**
 * Created by qingwei on 19/10/2015.
 */
var ViewBalance = (function () {
    function showViewBalancePopup(){
        ViewBalanceData.getLatestBalances();
        $("#balance-content").bPopup({
            positionStyle: "fixed",
            opacity: 0.6,
            position: ["auto", "auto"]
        });
    }

    function init(){
        $div = ViewBalanceUI.createBalancePopup();
        $div.appendTo(document.body);
        $("#view-balances").click(showViewBalancePopup);
    }

    return {
        init: init
    };
}());