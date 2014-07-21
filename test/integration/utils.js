module.exports.randomStr = function (length, initChars) {
    var chars = initChars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        str = '';
    for (var i = length; i > 0; --i) {
        str += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return str;
};

module.exports.openUrls = function (browser, urls) {

    urls.forEach(function (url) {

        var visitUrl = browser.globals.url + url;

        browser
            .url(visitUrl, function () {
                console.log("Opening ", visitUrl);
            })
            .waitForElementVisible('body', 5000);
    });
    browser.end();
};
