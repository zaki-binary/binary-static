var utils = require('../../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Java Charts', path: URL.CHARTS.JAVA_CHARTS },
    { page: 'Light Charts', path: URL.CHARTS.LIGHT_CHARTS },
    { page: 'Live Charts', path: URL.CHARTS.LIVE_CHARTS }
];

module.exports = utils.smokeTestUrls(urls);