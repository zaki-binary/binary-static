var URL = require('../../url');

var element = {
        emailInput: '#lp_email',
        resetPasswordButton: '#submit'
    },
    errorMsg = 'follow the instructions in the email we just sent you';

module.exports = {

    "loginPassword": function (browser) {
        
        browser
            .url(browser.launch_url + URL.ACCOUNT.LOST_PASSWORD)
            .waitForElementVisible('body', 5000)
            .setValue(element.emailInput, 'binary-test@mailinator.com')
            .click(element.resetPasswordButton)
            .waitForElementVisible('body', 5000)
            .assert.containsText('body', errorMsg)
        .end();
    }
};