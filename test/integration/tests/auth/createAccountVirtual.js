var formId = '#openAccForm',
    element = {
        form: formId,
        emailInput: formId + ' #Email', // should be input[type=email] but form needs fixing
        passwordInput: formId + ' input[type=password]',
        openAccountButton: '#submit'
    };

module.exports = {
    
    "createAccountSuccess": function (browser) {

        var randomStr = browser.globals.randomStr(5),
            randomEmail = 'binarytest-' + randomStr + '@mailinator.com';

        browser
            .url(browser.globals.url + '/c/linkto_acopening.cgi?actype=virtual')
            .waitForElementVisible(element.form, 5000)
            .setValue(element.emailInput, randomEmail)
            .setValue(element.passwordInput, 'password123')
            .click(element.openAccountButton)
            .pause(5000)
            .assert.containsText('body', 'Welcome')
        .end();
    }  
};