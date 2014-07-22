var utils = require('../../utils');

var urls = [
    '/charting',
    '/c/chart_application.cgi',
    '/d/smartchart.cgi',
    '/c/livechart.cgi'
];

module.exports.smokeBasic = function (browser) {
    utils.openUrls(browser, urls);
};
