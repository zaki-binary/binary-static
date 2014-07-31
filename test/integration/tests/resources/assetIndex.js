module.exports = {

    "assetIndex": function (browser) {
        browser
            .url(browser.launch_url + '/resources')
            .waitForElementVisible('body', 5000)
            .assert.containsText('body', 'Resources')
        .end();
    },
};