var URL = require('../../url');
var createAccountVirtualSuccess = require('./createAccountVirtualSuccess').createAccountVirtualSuccess;

var formId = '#changePasswordForm',
    element = {
        form: formId,
        currentPasswordInput: '#oldpassword',
        newPasswordInput: '#npassword',
        verifyNewPasswordInput: '#npassword2',
        changePasswordButton: '#submit'
    };

module.exports = {

    "changePasswordFail": function (browser) {

        createAccountVirtualSuccess(browser, true);

        browser
            .url(browser.launch_url + URL.ACCOUNT.CHANGE_PASSWORD)
            .waitForElementVisible(element.form, 5000)
            .setValue(element.currentPasswordInput, 'password123')
            .setValue(element.newPasswordInput, 'password123')
            .setValue(element.verifyNewPasswordInput, 'password123')
            .click(element.changePasswordButton)
            .assert.containsText('body', 'password has been changed')
        .end();
    }
};