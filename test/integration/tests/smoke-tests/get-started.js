var utils = require('../../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Why Choose Binary Trading?', path: URL.WHY_CHOOSE_BINARY_TRADING },
    { page: 'Types of trades', path: URL.TYPES_OF_TRADES },
    { page: 'Binary Options Basics', path: URL.BINARY_OPTIONS_BASICS },
    { page: 'Benefits of binary trading', path: URL.BENEFITS_OF_BINARY_TRADING },
    { page: 'How to trade binaries?', path: URL.HOW_TO_TRADE_BINARIES },
    { page: 'How to trade the random markets?', path: URL.HOW_TO_TRADE_THE_RANDOM_MARKETS },
    { page: 'What are the Smart Indices?', path: URL.WHAT_ARE_THE_SMART_INDICES },
    { page: 'FAQ', path: URL.FAQ },
    { page: 'Glossary', path: URL.GLOSSARY },
    { page: 'Tour', path: URL.TOUR }
];

module.exports = utils.smokeTestUrls(urls);