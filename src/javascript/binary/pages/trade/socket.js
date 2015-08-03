var TradeSocket = (function () {
    'use strict';

    var tradeSocket,
        socketUrl = "wss://www.devbin.io/websockets/contracts",
        bufferedSends = [];

    var status = function () {
        return tradeSocket && tradeSocket.readyState;
    };

    var isReady = function () {
        return tradeSocket && tradeSocket.readyState === 1;
    };

    var isClose = function () {
        return !tradeSocket || tradeSocket.readyState === 3;
    };

    var sendBufferedSends = function () {
        while (bufferedSends.length > 0) {
            tradeSocket.send(JSON.stringify(bufferedSends.shift()));
        }
    };

    var init = function (token) {
        tradeSocket = new WebSocket(socketUrl);

        tradeSocket.onopen = function (token){
            sendBufferedSends();
        };

        tradeSocket.onmessage = function (msg){
            Message.process(msg);
        };

        tradeSocket.onclose = function (e) {
            console.log('socket closed', e);
        };

        tradeSocket.onerror = function (error) {
            console.log('socket error', error);
        };
    };

    var send = function(data) {
        if (isClose()) {
            bufferedSends.push(data);
            init();
        } else if (isReady()) {
            tradeSocket.send(JSON.stringify(data));
        } else {
            bufferedSends.push(data);
        }
    };

    var close = function () {
        if (tradeSocket) {
            tradeSocket.close();
        }
    };

    return {
        init: init,
        send: send,
        close: close,
        socket: function () { return tradeSocket; }
    };

})();
