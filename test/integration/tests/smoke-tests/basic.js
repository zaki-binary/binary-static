var utils = require('../../utils');

var urls = [
    '',
    '/why-us',
    '/get-started',
    '/tour',
    '/c/trade.cgi',
    '/c/contact.cgi',

    '/c/linkto_acopening.cgi?actype=real',
    '/c/linkto_acopening.cgi?actype=virtual',
    '/c/affiliate_signup.cgi',
    '/responsible-trading',
    '/c/c_template.cgi?filecode=legal',

    '/d/tick_trades.cgi',
    '/c/pricing_table.cgi',
    '/c/rise_fall_table.cgi',
    '/c/asset_index.cgi',

    '/c/available_payment_methods.cgi',
    '/c/c_template.cgi?filecode=legal',

    '/why-us',
    '/get-started',
    '/tour',

    '/c/chart_application.cgi',
    '/d/smartchart.cgi',
    '/c/livechart.cgi',

    '/about-us',
    '/group-history',
    '/careers',
    '/partnerapi',

    '/c/contact.cgi',
    '/c/us_patents.cgi',
    '/open-source-projects'
];

module.exports.smokeBasic = function (browser) {
    utils.openUrls(browser, urls);
};
