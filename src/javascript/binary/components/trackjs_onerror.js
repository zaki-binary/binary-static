window._trackJs = {
    onError: function(payload, error) {

        // ignore an error caused by DealPly (http://www.dealply.com/) chrome extension
        if (payload.message.indexOf("DealPly") > 0) {
            return false;
        }

        if (payload.message.indexOf("NSA") > 0) {
            payload.message = "Redacted!";
        }

        // remove 401 network events, they happen all the time for us!
        payload.network = payload.network.filter(function(item) {
            if (item.statusCode !== 401) {
                return true;
            } else {
                return false;
            }
        });

        return true;
    }
};
