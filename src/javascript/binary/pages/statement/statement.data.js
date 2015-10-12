const StatementData = (function(){
    "use strict";
    
    var token = "8V9AOHhd0J4l2JZR5ZIWIhcybOBcDXfkavQD7xMcpi8vJThO"
    var authorized = false;
    var dataHandler = function(){
        throw "no data handler registered";
    };
    var errHandler = function(){
        throw "no error handler registered";
    };
    const ws = new WebSocket("wss://www.binary.com/websockets/v2");
    const wsRequestQueue = [];
    
    function wsSend(request){

        function pendingResponse(msg){
            dataHandler(msg);
        }

        function pendingAuthorization(msg){
            const json = JSON.parse(msg.data);
            if (json.error){
                StatementError.wsReqErrHandler(json.error);
            } else {
                authorized = true;
                ws.onmessage = pendingResponse;
                clearQueue();
            }
        }

        function clearQueue(){
           while (wsRequestQueue.length > 0) {
                const qr = wsRequestQueue[0];
                ws.send(JSON.stringify(qr));
                wsRequestQueue.shift();
            }
        }

        wsRequestQueue.push(request);
        ws.onmessage = authorized ? pendingResponse : pendingAuthorization;
        ws.onerror = errHandler;

        ws.onclose = function(event){
            authorized = false;
        }

        if (authorized) {
            clearQueue();
        } else {
            ws.onopen = function(){
                ws.send(JSON.stringify({authorize: token}));
            }
        }
    }
    
    function getBalance(){
        wsSend({balance: 1});
    }
    
    function getStatement(opts){
        var req = {statement: 1, description: 1};
        if(opts){
            console.log("opts : ", opts);   
            $.extend(true, req, opts);    
        }
        wsSend(req);
    }
    
    const publicMethods = {
        registerHandler: function(datahandler, errhandler){ 
            dataHandler = datahandler; 
            errHandler = errhandler;
        },
        getStatement: getStatement,
        getBalance: getBalance
    };
    
    return publicMethods;
}());
