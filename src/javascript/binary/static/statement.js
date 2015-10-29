pjax_config_page("statementws", function(){
    return {
        onLoad: function() {
<<<<<<< HEAD
=======
            TradeSocket.init();
>>>>>>> upstream/master
            StatementWS.init();
        },
        onUnload: function(){
            StatementWS.clean();
            TradeSocket.close();
        }
    };
<<<<<<< HEAD
});
=======
});

>>>>>>> upstream/master
