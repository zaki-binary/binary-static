
var ViewBalanceData = (function(){
    var initialized = false;
    var balanceSocket;

    var url = "wss://"+window.location.host+"/websockets/v3";

    if (page.language()) {
        url += '?l=' + page.language();
    }

    function subscribeToBalanceStream(cb){
        if (initialized) {
            return;
        }

        initialized = true;
        balanceSocket = new WebSocket(url);

        balanceSocket.onmessage = function(msg){
            var response = JSON.parse(msg.data);

            if (response.msg_type === "authorize") {
                balanceSocket.send(JSON.stringify({balance: 1}));
            }

            if (response.msg_type === "balance") {
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