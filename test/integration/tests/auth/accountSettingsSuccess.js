var URL = require('../../url');
var createAccountVirtualSuccess = require('./createAccountVirtualSuccess').createAccountVirtualSuccess;

var element = {
    form: '#changePasswordForm',
    emailAddressInput: '#Email',
    securityTab: 'a[href=#b-security]',
    ipAddressInput: '#ipsecurity',
    updateButton: '#submit'
};

module.exports = {

    "changeEmailFail": function (browser) {
        
        createAccountVirtualSuccess(browser, true);
        
        browser
            .url(browser.launch_url + URL.ACCOUNT.CHANGE_SETTINGS)
            .waitForElementVisible(element.emailAddressInput, 5000)
            .pause(5000)
            .setValue(element.emailAddressInput, 'vaild@email.com')
            .click(element.updateButton)
            .pause(5000)
            .assert.textNotPresent('body', 'enter your email address')
        .end();
    },

    "changeIPAddress": function (browser) {
        
        createAccountVirtualSuccess(browser, true);

        browser
            .url(browser.launch_url + URL.ACCOUNT.CHANGE_SETTINGS)
            .waitForElementVisible(element.securityTab, 5000)
            .click(element.securityTab)
            .pause(1000)
            .setValue(element.ipAddressInput, '') // current IP would be better
            .click(element.updateButton)
            .pause(5000)
            .assert.textNotPresent('body', 'enter your email address')
        .end();
    }
};