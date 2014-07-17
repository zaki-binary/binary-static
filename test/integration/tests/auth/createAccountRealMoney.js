var singinForm = '#virtual-acc-form',
    signinEmailField = '#virtual-acc-form input[type=email]',
    signinPasswordField = '#virtual-acc-form input[type=password]',
    signinButton = '#virtual-acc-form input[type=submit]',
    randomStr = browser.globals.randomStr(5),
    randomEmail = 'binary-' + randomEmail + '@mailinator.com';

module.exports = {
    
    "createAccountSuccess": function (browser) {
        browser
            .url(browser.globals.url)
            .waitForElementVisible(singinForm, 5000)
            .setValue(signinEmailField, randomEmail)
            .setValue(signinPasswordField, 'password123')
            .click(signinButton)
            .pause(5000)
            .assert.containsText('body', 'Welcome')
        .end();
    }  
};