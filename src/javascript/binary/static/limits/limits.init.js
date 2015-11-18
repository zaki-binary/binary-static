var LimitsWS = (function(){
    "use strict";

    function authHandler(response){
        var accountStatus = response.get_account_status;
        if (accountStatus[0] === 'active') {
            var element = document.getElementById('auth-message');
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

            var p = document.createElement("p");
            var textNode = document.createTextNode(Content.localize().textAuthenticatedWithdrawal);
            
            p.appendChild(textNode);
            element.appendChild(p);
        }
    }

    function limitsHandler(response){
        var limits = response.get_limits;
        Content.limitsTranslation();
        LimitsUI.fillLimitsTable(limits);

        var equivalent = " (" + Content.localize().textCurrencyEquivalent + ").";
        var num_of_days_limit = LimitsUI.addComma(limits['num_of_days_limit']);
        var withdrawal_since_inception_monetary = LimitsUI.addComma(limits["withdrawal_since_inception_monetary"]);
        var lifetime_limit = LimitsUI.addComma(limits["lifetime_limit"]);

        var withdrawal_limit = document.getElementById("withdrawal-limit");
        var already_withdraw = document.getElementById("already-withdraw");
        var withdrawal_limit_aggregate = document.getElementById("withdrawal-limit-aggregate");

        if(limits['num_of_days_limit'] === limits['lifetime_limit']) {
            withdrawal_limit.textContent = Content.localize().textWithdrawalLimits + " " + num_of_days_limit + equivalent;
            already_withdraw.textContent = Content.localize().textWithrawalAmount + " " + withdrawal_since_inception_monetary + ".";
        } else {
            withdrawal_limit.textContent = Content.localize().textYour + " " + limits['num_of_days'] + " " + Content.localize().textDayWithdrawalLimit + " " + num_of_days_limit + equivalent;
            already_withdraw.textContent = Content.localize().textWithrawalAmount + " " + limits['withdrawal_for_x_days_monetary'] + " " + Content.localize().textAggregateOverLast + " " + limits['num_of_days'] + " " + Content.localize().textDurationDays;
            if(lifetime_limit < 99999999) {
                withdrawal_limit_aggregate.textContent = Content.localize().textWithdrawalForEntireDuration + " " + lifetime_limit + equivalent;
                document.getElementById("already-withdraw-aggregate").textContent = Content.localize().textWithrawalAmount + " " + withdrawal_since_inception_monetary + " " + Content.localize().textInAggregateOverLifetime;
            }
            if(limits['remainder'] === 0) {
                withdrawal_limit_aggregate.textContent = Content.localize().textNotAllowedToWithdraw;
            } else if (limits['remainder'] !== 0) {
                withdrawal_limit_aggregate.textContent = Content.localize().textCurrentMaxWithdrawal + " " + LimitsUI.addComma(limits['remainder']) + equivalent;
            }

        }
    }

    function initTable(){
        $(".error-msg").text("");
        LimitsUI.clearTableContent();
    }

    function initPage(){
        LimitsData.getLimits();
        LimitsData.getAuth();
    }

    return {
        authHandler: authHandler,
        limitsHandler: limitsHandler,
        clean: initTable,
        init: initPage
    };
}());
