pjax_config_page("statementws", function(){
    return {
        onLoad: function() {
            BinarySocket.init();
            Content.populate();
            StatementWS.init();
        },
        onUnload: function(){
            StatementWS.clean();
        }
    };
});

