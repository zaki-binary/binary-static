exports.command = function (path, callback) {

    var self = this,
        goToUrl = self.globals.url + path;

    console.log('go', goToUrl);

    this.execute(function () {
        self.url(goToUrl);
        return true;
    }, [], function (result) {
        if (typeof callback === "function") {
            callback.call(self, result);
        }
    });

    return this;
};