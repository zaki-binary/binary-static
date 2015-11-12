
pjax_config_page("profit_table", function(){
    return {
        onLoad: function() {
            BinarySocket.init();
            Content.populate();
            ProfitTableWS.init();
        },
        onUnload: function(){
            ProfitTableWS.clean();
        }
    };
});