var element = {
        emailInput: '#lp_email',
        resetPasswordButton: '#submit'
    },
    errorMsg = 'follow the instructions in the email we just sent you';

module.exports = {

    "loginSuccess": function (browser) {
        browser
            .url(browser.globals.url + '/d/lost_password.cgi')
            .waitForElementVisible('body', 5000)
            .setValue(element.emailInput, 'binary-test@mailinator.com')
            .click(element.resetPasswordButton)
            .waitForElementVisible('body', 5000)
            .assert.containsText('body', errorMsg)
        .end();
    }
};