onLoad.queue_for_url(function() {
    $('#statement-date').on('change', function() {
        $('#submit-date').removeClass('invisible');
    });
}, 'statement');

pjax_config_page("statement", function(){
    return {
        onLoad: function(){
            console.log("statement page loaded");
            StatementWS.init();
        }
    }
});