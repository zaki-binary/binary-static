module.exports = {

    dist: {
        options: {
            ignore: ['#added_at_runtime', /test\-[0-9]+/],
            media: ['(min-width: 700px) handheld and (orientation: landscape)'],
            stylesheets: ['dist/css/binary.min.css'],
            //ignoreSheets: [/fonts.googleapis/],
            urls: [
                'https://binary.com',
                'https://www.binary.com/c/trade.cgi?market=forex',
                'https://www.binary.com/c/available_payment_methods.cgi',
                'https://www.binary.com/resources',
                'https://www.binary.com/charting',
                'https://www.binary.com/d/tick_trades.cgi'
            ],
            timeout: 1000,
            report: 'min'
        },
        files: {
            'dist/css/binary.css': ['empty.html']
        }
    }
};
