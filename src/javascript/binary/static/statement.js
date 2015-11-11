pjax_config_page("statementws", function(){
    return {
        onLoad: function() {
            Content.populate();
            StatementWS.init();
        },
        onUnload: function(){
            StatementWS.clean();
        }
    };
});

