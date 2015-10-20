pjax_config_page("statementws", function(){
    return {
        onLoad: function() {
            StatementWS.init();
        }
    };
});