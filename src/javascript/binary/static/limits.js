pjax_config_page("trading_withdrawal_limitws", function(){
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);

                    if (response) {
                        var type = response.msg_type;
                        if (type === 'get_limits'){
                            LimitsWS.limitsHandler(response);
                        }
                    }
                }
            });
            Content.populate();
            LimitsWS.init();
        },
        onUnload: function(){
            LimitsWS.clean();
        }
    };
});