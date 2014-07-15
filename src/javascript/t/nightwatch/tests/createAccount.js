var singinForm = '#virtual-acc-form',
    signinEmailField = '#virtual-acc-form input[type=email]',
    signinPasswordField = '#virtual-acc-form input[type=password]',
    signinButton = '#virtual-acc-form input[type=submit]';

module.exports = {
    
    "createAccountSuccess": function (browser) {
        browser
            .url("https://www.binary-beta.com")
            .waitForElementVisible(singinForm, 5000)
            .setValue(signinEmailField, 'binary-test@mailinator.com')
            .setValue(signinPasswordField, 'password123')
            .click(signinButton)
            .pause(5000)
            .assert.containsText('body', 'Welcome')
        .end();
    },
    
    "createAccountFail": function (browser) {
        browser
            .url("https://www.binary-beta.com")
            .waitForElementVisible(singinForm, 5000)
            .setValue(signinEmailField, 'incorrect')
            .setValue(signinPasswordField, '')
            .click(signinButton)
            .pause(5000)
            .assert.containsText('body', 'incorrect email')
        .end();
    }    
};