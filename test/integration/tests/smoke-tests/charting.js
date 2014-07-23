var utils = require('../../utils');

var urls = [
    { page: 'Java Charts', path: '/c/chart_application.cgi' },
    { page: 'Light Charts', path: '/d/smartchart.cgi' },
    { page: 'Live Charts', path: '/c/livechart.cgi' }
];

module.exports = utils.smoteTestUrls(urls);