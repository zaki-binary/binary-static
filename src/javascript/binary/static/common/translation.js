///***
// * this function will replace text based on the text for the whole container
// * @param dom dom element , not jquery object!!
// * @param replacementFunction is a function that takes in the text found
// */
//function replaceAllTextInElement(dom, replacementFunction){
//    if (dom.nodeType === Node.TEXT_NODE) {
//        dom.textContent = replacementFunction(dom.textContent);
//    }
//    var children = dom.childNodes;
//    if (children) {
//        for (var i = 0 ; i < children.length ; i++){
//            replaceAllTextInElement(children[i], replacementFunction);
//        }
//    }
//}
//
//
///***
// * To add any new translation, one can follow the similar code as below,
// * it will call text.localize all every single text exists in the DOM
// * you pass in
// */
//var Translation = (function(){
//
//    function statementPage(){
//        var container = document.getElementById("statement-ws-container");
//
//        replaceAllTextInElement(container, function(t){
//           return text.localize(t);
//        });
//    }
//
//    return {
//      statement: statementPage
//    };
//}());
