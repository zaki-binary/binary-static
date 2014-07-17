var formId = '#login-form',
    element = {
        form: '#login-form',
        loginIdInput: '#login-form input[type=text]',
        passwordInput: '#login-form input[type=password]',
        loginButton: '#login-form input[type=submit]'
    };

function loginWith(browser, login, password, containsText) {
  
    browser
        .url(browser.globals.url)
        .waitForElementVisible(element.form, 5000)
        .setValue(element.loginIdInput, login)
        .setValue(element.passwordInput, password)
        .click(element.loginButton)
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