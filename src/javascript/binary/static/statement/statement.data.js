var StatementData = (function(){
    "use strict";
    var currentLastTransaction;
    var hasOlder = true;

    function getStatement(opts){
        var req = {statement: 1, description: 1};
        if(opts){ 
            $.extend(true, req, opts);    
        }

        TradeSocket.send(req);
    }

    return {
        getStatement: getStatement,
        currentLastTransaction: currentLastTransaction,
        hasOlder: hasOlder
    };
}());
