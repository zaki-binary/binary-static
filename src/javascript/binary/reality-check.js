(function ($) {
    "use strict";

    function RealityCheck() {
    };

    RealityCheck.prototype.init = function (cookieName) {
        console.log(cookieName);
        this.cookieName = cookieName;
    };
}(jQuery));
