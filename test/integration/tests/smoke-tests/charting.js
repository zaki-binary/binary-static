var utils = require('../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Java Charts', path: URL.JAVA_CHARTS },
    { page: 'Light Charts', path: URL.LIGHT_CHARTS },
    { page: 'Live Charts', path: URL.LIVE_CHARTS }
];

module.exports = utils.smoteTestUrls(urls);