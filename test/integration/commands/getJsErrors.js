exports.command = function (callback) {

    var self = this;

    this.execute(function () {

        return window.jsErrors;

    }, [], function (result) {
        if (typeof callback === "function") {
            callback.call(self, result);
        }
    });

    return this;
};