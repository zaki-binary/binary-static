var loginSuccess = require('./loginSuccess').loginSuccess;

var formId = '#login-form',
    element = {
        form: formId,
        loginIdInput: formId + ' input[type=text]',
        passwordInput: formId + ' input[type=password]',
        loginButton: formId + ' input[type=submit]',
        logoutButton: '#btn_logout'
    };

module.exports = {

    "loginSuccess": function (browser) {

        loginSuccess(browser);

        browser
            .assert.visible(logoutButton)
            .click(logoutButton)
            .pause(5000)
            .assert.visible(loginButton)
        .end();
    }
};