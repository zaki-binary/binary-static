var loginForm = '#login-form',
    loginIdField = '#login-form input[type=text]',
    passwordField = '#login-form input[type=password]',
    loginButton = '#login-form input[type=submit]';

module.exports = {
    
    "loginFail": function (browser) {
        browser
            .url("https://www.binary-beta.com")
            .waitForElementVisible(loginForm, 5000)
            .setValue(loginIdField, 'VRTC449697')
            .setValue(passwordField, 'wrongpassword')
            .click(loginButton)
            .pause(3000)
            .assert.containsText('body', 'Login ID not given.') 
        .end();
    }  
};