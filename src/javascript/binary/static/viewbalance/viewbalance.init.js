/**
 * Created by qingwei on 19/10/2015.
 */
var ViewBalance = (function () {
    function showViewBalancePopup(){
        $("#balance-content").removeClass("invisible");
    }

    function closeViewBalancePopup(){
        $("#balance-content").addClass("invisible");
    }

    function init(){
        ViewBalanceUI.createBalancePopup();
        $("#view-balances").click(showViewBalancePopup);
        $("#close-balances").click(closeViewBalancePopup);
        console.info("view balance init");
    }

    return {
        init: init
    };
}());