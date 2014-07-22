var utils = require('../../utils');

var element = {
    form: '#openAccForm',
    openAccountButton: '#submit'
},
    errorList = [
        'enter your first name',
        'use only letters',
        'enter your email address',
        'input a valid date',
        'enter the first line of your home address',
        'enter a town or city',
        'nvalid telephone number',
        'enter a password',
        'secret answer is too short',
        'must accept the terms and conditions'
    ];

module.exports.init = function (browser) {
    browser
        .url(browser.globals.url + '/c/linkto_acopening.cgi?actype=real')
        .waitForElementVisible(element.form, 5000)
        .click(element.openAccountButton)
        .pause(5000);
};

errorList.forEach(function (str) {
    module.exports[str] = function (browser) {
        browser.assert.containsText('body', str, "Checking for " + str);
    };
});

module.exports.end = function (browser) {
    browser.end();
};