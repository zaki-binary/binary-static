var element = {
    form: '#openAccForm',
    firstNameInput: '#fname',
    familyNameInput: '#lname',
    emailInput: '#Email',
    dateofBirthInputs: '???',
    firstLineAddressInput: '#Address1',
    townCityInput: '#AddressTown',
    telephoneInput: '#Tel',
    passwordInput: '#chooseapassword',
    secretAnswerInput: '#secretanswer',
    agreeToTermsCheckbox: '#tnc',
    openAccountButton: '#submit'
};

module.exports = {

    "createAccountRealMoneyFail": function (browser) {

        browser
            .url(browser.globals.url + '/c/linkto_acopening.cgi?actype=real')
            .waitForElementVisible(element.form, 5000)
            .click(element.openAccountButton)
            .pause(5000)
            .assert.containsText('body', 'enter your first name')
            .assert.containsText('body', 'use only letters')
            .assert.containsText('body', 'enter your email address')
            .assert.containsText('body', 'input a valid date')
            .assert.containsText('body', 'enter the first line of your home address')
            .assert.containsText('body', 'enter a town or city')
            .assert.containsText('body', 'nvalid telephone number')
            .assert.containsText('body', 'enter a password')
            .assert.containsText('body', 'secret answer is too short')
        .end();
    }
};