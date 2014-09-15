var utils = require('../../../utils');
var URL = require('../../url');

var urls = [
    { page: 'Trading Account Real', path: URL.TRADING_ACCOUNT_REAL },
    { page: 'Trading Account Virtual', path: URL.TRADING_ACCOUNT_VIRTUAL },
    { page: 'Affiliate Program', path: URL.AFFILIATE_PROGRAM },
    { page: 'Responsible Trading', path: URL.RESPONSIBLE_TRADING },
    { page: 'Terms and Conditions', path: URL.TERMS_AND_CONDITIONS },

    { page: 'Pricing Table', path: URL.PRICING_TABLE },
    { page: 'Rise/Fall Table', path: URL.RISE_FALL_TABLE },
    { page: 'Asset Index', path: URL.ASSET_INDEX },

    { page: 'Payment Methods', path: URL.PAYMENT_METHODS },
    { page: 'Security and Privacy', path: URL.SECURITY_AND_PRIVACY },

    { page: 'Why Us?', path: URL.WHY_US },
    { page: 'Getting Started', path: URL.GETTING_STARTED },
    { page: 'Platform Tour', path: URL.PLATFORM_TOUR },

    { page: 'Chart Application', path: URL.CHART_APPLICATION },
    { page: 'Light Charts', path: URL.LIGHT_CHARTS },
    { page: 'Live Charts', path: URL.LIVE_CHARTS },

    { page: 'Group Information', path: URL.GROUP_INFORMATION },
    { page: 'Group History', path: URL.GROUP_HISTORY },
    { page: 'Careers', path: URL.CAREERS },
    { page: 'Partner API', path: URL.PARTNER_API },
    { page: 'Contact Us', path: URL.CONTACT_US },
    { page: 'US Patents', path: URL.US_PATENTS },
    { page: 'Open Source', path: URL.OPEN_SOURCE }
];

module.exports = utils.smokeTestUrls(urls);
