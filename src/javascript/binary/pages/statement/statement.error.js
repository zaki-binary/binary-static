const StatementError = (function(){
    function genericErrorHandler(err){
        console.log(err);
    }
    
    function wsRequestErrorHandler(wsErrorPayload){
        StatementUI.clearTable();
        const $errorDiv = $("<div></div>", {class: "error-msg", text: wsErrorPayload.error.message});
        $errorDiv.insertBefore($("#statement-table-footer"));
    }
    
    return {
        genericErrHandler: genericErrorHandler,
        wsReqErrHandler: wsRequestErrorHandler
    };
}());