
var ViewBalanceData = (function(){
    var initialized = false;
    var balanceSocket;
    var url = "wss://"+window.location.host+"/websockets/v3";

    function subscribeToBalanceStream(cb){
        if (initialized) {
            return;
        }

        initialized = true;

        if (page.language()) {
            url += '?l=' + page.language();
        }

        balanceSocket = new WebSocket(url);

        balanceSocket.onmessage = function(msg){
            var response = JSON.parse(msg.data);

            if (response.msg_type === "authorize") {
                balanceSocket.send(JSON.stringify({balance: 1}));
            } else if (response.msg_type === "balance") {
                console.log("balance received");
                cb(response.balance);
            }
        };

        balanceSocket.onclose = function(){
            initialized = false;
            subscribeToBalanceStream(cb);
        };

        balanceSocket.onopen = function () {
            var loginToken = getCookieItem('login');
            if (loginToken) {
                balanceSocket.send(JSON.stringify({authorize: loginToken}));
            }
        };
    }
    return {
        subscribeToBalanceStream: subscribeToBalanceStream
    };
}());