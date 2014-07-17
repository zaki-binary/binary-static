var formId = '#virtual-acc-form',
    element = {
        form: formId,
        emailInput: formId + ' input[type=email]',
        passwordInput: formId + ' input[type=password]',
        signinButton: formId + ' input[type=submit]'
    };

module.exports = {

    "createAccountFail": function (browser) {
        
        browser
            .url(browser.globals.url)
            .waitForElementVisible(element.form, 5000)
            .setValue(element.emailInput, 'incorrect@email.com')
            .setValue(element.passwordInput, '1')
            .click(element.signinButton)
            .pause(5000)
            .assert.containsText('body', 'incorrect email')
        .end();
    }
};