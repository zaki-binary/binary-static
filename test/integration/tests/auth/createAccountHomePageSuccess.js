var utils = require('../../../utils');

var formId = '#virtual-acc-form',
    element = {
        form: formId,
        emailInput: formId + ' input[type=email]',
        passwordInput: formId + ' input[type=password]',
        signinButton: formId + ' input[type=submit]'
    };

module.exports = {

    "createAccountHomePageSuccess": function (browser) {

        var randomStr = utils.randomStr(5),
            randomEmail = 'binarytest-' + randomStr + '@mailinator.com';

        browser
            .url(browser.launch_url)
            .waitForElementVisible(element.form, 5000)
            .setValue(element.emailInput, randomEmail)
            .setValue(element.passwordInput, randomStr)
            .click(element.signinButton)
            .pause(5000)
            .assert.containsText('body', 'Welcome')
        .end();
    }
};