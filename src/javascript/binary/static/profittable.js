
pjax_config_page("profit_tablews", function(){
    return {
        onLoad: function() {
            Content.populate();
            ProfitTableWS.init();
        },
        onUnload: function(){
            ProfitTableWS.clean();
        }
    };
});