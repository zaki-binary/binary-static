var utils = require('../../utils');

var urls = [
    { page: 'Why Choose Binary Trading?', path: '/get-started/what-is-binary-trading' },
    { page: 'Types of trades', path: '/get-started/types-of-trades' },
    { page: 'Binary Options Basics', path: '/get-started/binary-options-basics' },
    { page: 'Benefits of binary trading', path: '/get-started/benefits-of-trading-binaries' },
    { page: 'How to trade binaries?', path: '/get-started/how-to-trade-binaries' },
    { page: 'How to trade the random markets?', path: '/get-started/random-markets' },
    { page: 'What are the Smart Indices?', path: '/smart-indices' },
    { page: 'FAQ', path: '/get-started/beginners-faq' },
    { page: 'Glossary', path: '/get-started/glossary' },
    { page: 'Tour', path: '/tour' }
];

module.exports = utils.smoteTestUrls(urls);