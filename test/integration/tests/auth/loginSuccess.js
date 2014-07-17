var fomId = '#login-form',
    element = {
        form: formId,
        loginIdInput: formId + ' input[type=text]',
        passwordInput: formId + ' input[type=password]',
        loginButton: formId + ' input[type=submit]'
    };
    
module.exports = {
    
    "loginSuccess": function (browser) {
        browser
            .url(browser.globals.url)
            .waitForElementVisible(element.form, 5000)
            .setValue(element.loginIdInput, 'VRTC449697')
            .setValue(element.passwordInput, 'letmein')
            .click(element.loginButton)
            .pause(5000)
            .assert.containsText('body', 'welcome')
        .end();
    }
};