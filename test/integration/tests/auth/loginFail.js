var loginForm = '#login-form',
    loginIdField = '#login-form input[type=text]',
    passwordField = '#login-form input[type=password]',
    loginButton = '#login-form input[type=submit]';

function loginWith(browser, login, password, containsText) {
  
    browser
        .url(browser.globals.url)
        .waitForElementVisible(loginForm, 5000)
        .setValue(loginIdField, login)
        .setValue(passwordField, password)
        .click(loginButton)
        .assert.containsText('body', containsText)
    .end();
}

module.exports = {

    "loginFailNoPassword": function (browser) {
        loginWith(browser, 'VRTC449697', '', 'Password not given.');
    },
    "loginFailNoLogin": function (browser) {
        loginWith(browser, '', '', 'Login ID not given.');
    },
    "loginFailAccountUnavailable": function (browser) {
        loginWith(browser, 'VRTC449697', 'wrongpassword', 'account is unavailable');
    }
};