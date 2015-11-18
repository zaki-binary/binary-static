var LimitsUI = (function(){
    "use strict";

    function fillLimitsTable(limits){
        var open_positions = (limits['open_positions']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var account_balance = (limits['account_balance']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var daily_turnover = (limits['daily_turnover']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var payout = (limits['payout']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        document.getElementById('item').textContent = Content.localize().textItem;
        
        var currency = TUser.get().currency;
        if (currency === "") {
            currency = "USD";
        }
        document.getElementById('limit').textContent = Content.localize().textLimit + " (" + currency + ")";
        
        $('#max-open-position').prepend(Content.localize().textMaxOpenPosition);
        document.getElementById('max-open-position-tooltip').setAttribute('title', Content.localize().textMaxOpenPositionTooltip);
        document.getElementById('open-positions').textContent = open_positions;
        
        $('#max-acc-balance').prepend(Content.localize().textMaxAccBalance);
        document.getElementById('max-acc-balance-tooltip').setAttribute('title', Content.localize().textMaxAccBalanceTooltip);
        document.getElementById('account-balance').textContent = account_balance;
        
        $('#max-daily-turnover').prepend(Content.localize().textMaxDailyTurnover);
        document.getElementById('max-daily-turnover-tooltip').setAttribute('title', Content.localize().textMaxDailyTurnoverTooltip);
        document.getElementById('daily-turnover').textContent = daily_turnover;
        
        $('#max-aggregate').prepend(Content.localize().textMaxAggregate);
        document.getElementById('max-aggregate-tooltip').setAttribute('title', Content.localize().textMaxAggregateTooltip);
        document.getElementById('payout').textContent = payout;
    }

    function clearTableContent(){
        Table.clearTableBody(tableID);
        $("#" + tableID +">tfoot").hide();
    }
    
    return {
        clearTableContent: clearTableContent,
        fillLimitsTable: fillLimitsTable
    };
}());
