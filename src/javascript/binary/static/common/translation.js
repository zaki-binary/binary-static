/***
 * this function will replace text based on the text for the whole container
 * @param id element's id
 * @param replacementFunction is a function that takes in the text found
 */
function replaceAllTextInElement(dom, replacementFunction){
    if (dom.nodeType === Node.TEXT_NODE) {
        dom.nodeValue = replacementFunction(dom.nodeValue);
    }
    var children = dom.childNodes;
    if (children) {
        for (var i = 0 ; i < children.length ; i++){
            replaceAllTextInElement(children[i], replacementFunction);
        }
    }
}

var Translation = (function(){

    function statementPage(){
        var container = document.getElementById("statement-ws-container");
        replaceAllTextInElement(container, function(t){
           return text.localize(t);
        });
    }

    return {
      statement: statementPage
    };
}());