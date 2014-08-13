var URL = require('../../url');

var element = {
    form: '#openAccForm',
    openAccountButton: '#submit'
},
    errorList = [
        'enter your first name',
        'use only letters',
        'enter your email address',
        'input a valid date',
        'specify your country',
        'enter the first line of your home address',
        'enter a town or city',
        'invalid telephone number',
        'enter a password',
        'secret answer is too short',
        'must accept the terms and conditions'
    ];

module.exports.init = function (browser) {
    browser
        .url(browser.launch_url + URL.ACCOUNT.REAL_MONEY)
        .waitForElementVisible(element.form, 5000)
        .click(element.openAccountButton)
        .pause(5000);
};

errorList.forEach(function (str) {
    module.exports["Checking for " + str] = function (browser) {
        browser.assert.containsText(element.form, str);
    };
});

module.exports.end = function (browser) {
    browser.end();
};
