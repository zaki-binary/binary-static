var utils = require('../../utils');

var urls = [
    '/d/portfolio.cgi',
    '/d/statement.cgi',
    '/d/change_password.cgi',
    '/d/settings.cgi?o=settings',
    '/c/affiliate_signup.cgi',
    '/c/available_payment_methods.cgi'
];

module.exports.smokeBasic = function (browser) {
    utils.openUrls(browser, urls);
};
