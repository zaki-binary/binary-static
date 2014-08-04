var URL = require('../../url');

var element = {
    downloadButton: 'a.button'
};

module.exports = {

    "javaChartsHaveDownloadButton": function (browser) {
        browser
            .url(browser.launch_url + URL.CHARTS.JAVA_CHARTS)
            .waitForElementVisible('body', 5000)
            .assert.visible(element.downloadButton)
            .assert.containsText(element.downloadButton, 'DOWNLOAD')
        .end();
    },
};