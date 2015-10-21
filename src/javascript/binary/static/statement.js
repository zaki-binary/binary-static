pjax_config_page("statementws", function(){
    return {
        onLoad: function() {
            console.log("statement page loaded");
            StatementWS.init();
        },
        onUnload: function(){
            console.log("statement page offloaded");
            StatementWS.clean();
        }
    };
});

