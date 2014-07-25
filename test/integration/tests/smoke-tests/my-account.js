var utils = require('../../utils');

var urls = [
    { page: 'Portfolio', path: '/d/portfolio.cgi' },
    { page: 'Statement', path: '/d/statement.cgi' },
    { page: 'Password', path: '/d/change_password.cgi' },
    { page: 'Settings', path: '/d/settings.cgi?o=settings' },
    { page: 'Affiliate', path: '/c/affiliate_signup.cgi' },
    { page: 'Payment methods', path: '/c/available_payment_methods.cgi' }
];

module.exports = utils.smoteTestUrls(urls);