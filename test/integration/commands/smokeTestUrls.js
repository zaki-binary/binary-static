exports.command = function (urls) {

    var browser = this;

    this.execute(function () {

        urls.forEach(function (url) {
            browser
                .url(browser.launch_url + url.path)
                .waitForElementVisible('body', 5000)
                .pause(2000);
        });

        return true;
        
    }, [], function (result) {
        if (typeof callback === "function") {
            callback.call(self, result);
        }
    });

    return this;
};

