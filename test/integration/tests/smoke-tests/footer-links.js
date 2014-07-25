var utils = require('../../utils');

var urls = [
    { page: 'Trading Account Real', path: '/c/linkto_acopening.cgi?actype=real' },
    { page: 'Trading Account Virtual', path: '/c/linkto_acopening.cgi?actype=virtual' },
    { page: 'Affiliate Program', path: '/c/affiliate_signup.cgi' },
    { page: 'Responsible Trading', path: '/responsible-trading' },
    { page: 'Terms and Conditions', path: '/c/c_template.cgi?filecode=legal' },

    { page: 'Tick Trades', path: '/d/tick_trades.cgi' },
    { page: 'Pricing Table', path: '/c/pricing_table.cgi' },
    { page: 'Rise/Fall Table', path: '/c/rise_fall_table.cgi' },
    { page: 'Asset Index', path: '/c/asset_index.cgi' },

    { page: 'Payment Methods', path: '/c/available_payment_methods.cgi' },
    { page: 'Security and Privacy', path: '/c/c_template.cgi?filecode=legal' },

    { page: 'Why Us?', path: '/why-us' },
    { page: 'Getting Started', path: '/get-started' },
    { page: 'Platform Tour', path: '/tour' },

    { page: 'Chart Application', path: '/c/chart_application.cgi' },
    { page: 'Light Charts', path: '/d/smartchart.cgi' },
    { page: 'Live Charts', path: '/c/livechart.cgi' },

    { page: 'Group Information', path: '/about-us' },
    { page: 'Group History', path: '/group-history' },
    { page: 'Careers', path: '/careers' },
    { page: 'Partner API', path: '/partnerapi' },
    { page: 'Contact Us', path: '/c/contact.cgi' },
    { page: 'US Patents', path: '/c/us_patents.cgi' },
    { page: 'Open Source', path: '/open-source-projects' }
];

module.exports = utils.smoteTestUrls(urls);