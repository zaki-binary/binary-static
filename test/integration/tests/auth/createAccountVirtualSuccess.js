var utils = require('../../../utils');
var URL = require('../../url');

var formId = '#openAccForm',
    element = {
        form: formId,
        emailInput: '#Email', // should be input[type=email] but form needs fixing
        countryOfResidenceInput: '#residence',
        passwordInput: formId + ' input[type=password]',
        openAccountButton: '#submit'
    };

module.exports = {

    "createAccountVirtualSuccess": function (browser, doNotEnd) {

        var randomStr = utils.randomStr(5),
            randomEmail = 'binarytest-' + randomStr + '@mailinator.com';

        browser
            .url(browser.launch_url + URL.ACCOUNT.CREATE_VIRTUAL)
            .waitForElementVisible(element.form, 5000)
            .setValue(element.emailInput, randomEmail)
            .setValue(element.countryOfResidenceInput, 'Austria')        
            .setValue(element.passwordInput, 'password123')
            .click(element.openAccountButton)
            .pause(5000)
            .assert.containsText('body', 'Welcome');

        if (!doNotEnd) browser.end();
    }
};