var URL = require('../../url');

var element = {    
    downloadButton: 'a.button'
};

module.exports = {

    "liveCharts": function (browser) {
        browser
            .url(browser.launch_url + URL.CHARTS.LIVE_CHARTS)
            .waitForElementVisible('body', 5000)
            .assert.containsText(element.downloadButton, 'Download')
        .end();
    },
};