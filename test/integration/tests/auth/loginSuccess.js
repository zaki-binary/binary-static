var loginForm = '#login-form',
    loginIdField = '#login-form input[type=text]',
    passwordField = '#login-form input[type=password]',
    loginButton = '#login-form input[type=submit]';

module.exports = {
    
    "loginSuccess": function (browser) {
        browser
            .url(browser.globals.url)
            .waitForElementVisible(loginForm, 5000)
            .setValue(loginIdField, 'VRTC449697')
            .setValue(passwordField, 'letmein')
            .click(loginButton)
            .pause(5000)
            .assert.containsText('body', 'incorrect email')
        .end();
    }
};