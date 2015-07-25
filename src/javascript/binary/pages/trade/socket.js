var TradeSocket = (function () {
    'use strict';

    var tradeSocket,
        socketUrl = "wss://www.devbin.io/websockets/contracts";

    var status = function () {
        return tradeSocket && tradeSocket.readyState;
    };

    var isReady = function () {
        return tradeSocket && tradeSocket.readyState == 1;
    };

    var onOpen = function (token) {
        tradeSocket.send(JSON.stringify({
            authorize: token
        }));

        tradeSocket.send(JSON.stringify({
            offerings: {hierarchy: 1, contracts: 0}
        }));
    };

    var onMessage = function (msg) {
        var response = JSON.parse(msg.data);
        Message.process(msg);
    };

    var onClose = function (e) {
        console.log('socket closed', e);
    };

    var onError = function (error) {
        console.log('socket error', error);
    };

    var init = function (token) {
        tradeSocket = new WebSocket(socketUrl);

        tradeSocket.onopen = onOpen(token);
        tradeSocket.onmessage = onMessage;
        tradeSocket.onclose = onClose;
        tradeSocket.onerror = onError;
    };

    var send = function(data) {
        if (isReady()) {
            tradeSocket.send(JSON.stringify(data));
        } else {
        }
    };

    return {
        init: init,
        status: status,
        socket: tradeSocket,
        send: send
    };

})();
