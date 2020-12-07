const loadScript  = require('scriptjs');
const DerivBanner = require('../../../common/deriv_banner');
const getLanguage = require('../../../../_common/language').get;

const MetaTraderTerminal = (() => {
    let is_loaded;

    const onLoad = () => {
        const curr_language = getLanguage().toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);
        const login = urlParams.get('login');
        const servers = urlParams.get('servers');
        const trade_server = urlParams.get('trade_server');

        DerivBanner.onLoad();
        if (!is_loaded) {
            loadScript.get('https://trade.mql5.com/trade/widget.js', () => {
                loadTerminal(curr_language, login, servers, trade_server);
                is_loaded = true;
            });
        } else {
            loadTerminal(curr_language, login, servers, trade_server);
        }
    };

    const loadTerminal = (lang, login, servers, trade_server) => {
        // eslint-disable-next-line no-new, no-undef
        new MetaTraderWebTerminal('webterminal', {
            version    : 5,
            login,
            servers    : servers ? [ servers ] : ['Deriv-Demo', 'Deriv-Server'],
            server     : trade_server || 'Deriv-Demo',
            utmSource  : 'www.deriv.com',
            startMode  : 'login',
            language   : lang,
            colorScheme: 'black_on_white',
        });
        const $loader = $('#metatrader_webterminal').find('.barspinner');
        $loader.remove();
    };

    const onUnload = () => {
        DerivBanner.onUnload();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = MetaTraderTerminal;
