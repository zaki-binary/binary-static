var formId = '#openAccForm',
    element = {
        form: formId,
        emailInput: formId + ' input[type=email]',
        passwordInput: formId + ' input[type=password]',
        signinButton: formId + ' input[type=submit]'
    };

module.exports = {
    
    "createAccountSuccess": function (browser) {

        var randomStr = browser.globals.randomStr(5),
            randomEmail = 'binary-' + randomStr + '@mailinator.com';

        browser
            .url(browser.globals.url + '/c/linkto_acopening.cgi?actype=virtual')
            .waitForElementVisible(element.form, 5000)
            .setValue(element.emailInput, randomEmail)
            .setValue(element.passwordInput, 'password123')
            .click(signinButton)
            .pause(5000)
            .assert.containsText('body', 'Welcome')
        .end();
    }  
};