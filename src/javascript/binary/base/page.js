const Cookies          = require('js-cookie');
const BinaryPjax       = require('./binary_pjax');
const Client           = require('./client');
const Contents         = require('./contents');
const Crowdin          = require('./crowdin');
const Header           = require('./header');
const Language         = require('./language');
const Localize         = require('./localize');
const localize         = require('./localize').localize;
const Login            = require('./login');
const Menu             = require('./menu');
const State            = require('./storage').State;
const Url              = require('./url');
const createElement    = require('./utility').createElement;
const elementInnerHtml = require('../common_functions/common_functions').elementInnerHtml;
const checkLanguage    = require('../common_functions/country_base').checkLanguage;
const scrollToTop      = require('../common_functions/scroll').scrollToTop;
const TrafficSource    = require('../common_functions/traffic_source');
const BinarySocket     = require('../websocket_pages/socket');
const RealityCheck     = require('../websocket_pages/user/reality_check/reality_check');
const AffiliatePopup   = require('../../binary_japan/affiliate_popup');
const PushNotification = require('../../lib/push_notification');
require('../../lib/polyfills/array.includes');
require('../../lib/polyfills/string.includes');

const Page = (() => {
    const init = () => {
        State.set('is_loaded_by_pjax', false);
        Url.init();
        PushNotification.init();
        onDocumentReady();
        Crowdin.init();
    };

    const onDocumentReady = () => {
        // LocalStorage can be used as a means of communication among
        // different windows. The problem that is solved here is what
        // happens if the user logs out or switches loginid in one
        // window while keeping another window or tab open. This can
        // lead to unintended trades. The solution is to reload the
        // page in all windows after switching loginid or after logout.

        // onLoad.queue does not work on the home page.
        // jQuery's ready function works always.
        $(document).ready(() => {
            // Cookies is not always available.
            // So, fall back to a more basic solution.
            window.addEventListener('storage', (evt) => {
                switch (evt.key) {
                    case 'active_loginid':
                        // not the active tab and logged out or loginid switch
                        if (document.hidden && (evt.newValue === '' || !window.is_logging_in)) {
                            reload();
                        }
                        break;
                    case 'new_release_reload_time':
                        if (evt.newValue !== evt.oldValue) {
                            reload(true);
                        }
                        break;
                    // no default
                }
            });
            scrollToTop();
            showNotificationOutdatedBrowser();
        });
    };

    const onLoad = () => {
        if (State.get('is_loaded_by_pjax')) {
            Url.reset();
        } else {
            init();
            if (!Login.isLoginPages()) {
                Language.setCookie(Language.urlLang());
            }
            Localize.forLang(Language.urlLang());
            Header.onLoad();
            Language.setCookie();
            Menu.makeMobileMenu();
            recordAffiliateExposure();
            endpointNotification();
        }
        Menu.init();
        Contents.onLoad();

        const ico_banner = document.getElementById('ico_banner');
        const page_allows_banner = () => (!/(ico-subscribe|ico-info)/.test(window.location.pathname));

        if (!sessionStorage.getItem('hide_ico_banner') && ico_banner && page_allows_banner()) {
            ico_banner.removeEventListener('click', clickIcoBannerButton);
            ico_banner.addEventListener('click', clickIcoBannerButton);
            ico_banner.classList.remove('invisible');
            const ico_banner_btn = document.getElementById('ico_link_button');
            if (ico_banner_btn) {
                ico_banner_btn.removeEventListener('click', clickIcoBannerButton);
                ico_banner_btn.addEventListener('click', clickIcoBannerButton);
            }

        }

        const close_ico_banner = document.getElementById('close_ico_banner');
        if (close_ico_banner) {
            close_ico_banner.removeEventListener('click', removeIcoBanner);
            close_ico_banner.addEventListener('click', removeIcoBanner);
        }

        if (sessionStorage.getItem('showLoginPage')) {
            sessionStorage.removeItem('showLoginPage');
            Login.redirectToLogin();
        }
        if (Client.isLoggedIn()) {
            BinarySocket.wait('authorize').then(() => {
                checkLanguage();
                RealityCheck.onLoad();
            });
        } else {
            checkLanguage();
        }
        TrafficSource.setData();
    };

    const onUnload = () => {
        Menu.onUnload();
    };

    const clickIcoBannerButton = (e) => {
        e.stopPropagation();
        BinaryPjax.load(Url.urlFor('user/ico-subscribe'));
    };

    const removeIcoBanner = (e) => {
        e.stopPropagation();
        document.getElementById('ico_banner').classList.add('invisible');
        sessionStorage.setItem('hide_ico_banner', true);
    };

    const recordAffiliateExposure = () => {
        const token = Url.param('t');
        if (!token || token.length !== 32) {
            return false;
        }

        AffiliatePopup.show();

        const token_length  = token.length;
        const is_subsidiary = /\w{1}/.test(Url.param('s'));

        const cookie_token = Cookies.getJSON('affiliate_tracking');
        if (cookie_token) {
            // Already exposed to some other affiliate.
            if (is_subsidiary && cookie_token && cookie_token.t) {
                return false;
            }
        }

        // Record the affiliate exposure. Overwrite existing cookie, if any.
        const cookie_hash = {};
        if (token_length === 32) {
            cookie_hash.t = token.toString();
        }
        if (is_subsidiary) {
            cookie_hash.s = '1';
        }

        Cookies.set('affiliate_tracking', cookie_hash, {
            expires: 365, // expires in 365 days
            path   : '/',
            domain : `.${location.hostname.split('.').slice(-2).join('.')}`,
        });
        return true;
    };

    const reload = (forced_reload) => { window.location.reload(!!forced_reload); };

    const endpointNotification = () => {
        const server = localStorage.getItem('config.server_url');
        if (server && server.length > 0) {
            const message = `${(/www\.binary\.com/i.test(window.location.hostname) ? '' :
                `${localize('This is a staging server - For testing purposes only')} - `)}
                ${localize('The server <a href="[_1]">endpoint</a> is: [_2]', [Url.urlFor('endpoint'), server])}`;

            const end_note = document.getElementById('end-note');

            elementInnerHtml(end_note, message);
            if (end_note) end_note.setVisibility(1);

            const footer = document.getElementById('footer');
            if (footer) footer.style['padding-bottom'] = end_note.offsetHeight;
        }
    };

    const showNotificationOutdatedBrowser = () => {
        const src = '//browser-update.org/update.min.js';
        if (document.querySelector(`script[src*="${src}"]`)) return;
        window.$buoop = {
            vs     : { i: 11, f: -4, o: -4, s: 9, c: -4 },
            api    : 4,
            l      : Language.get().toLowerCase(),
            url    : 'https://whatbrowser.org/',
            noclose: true, // Do not show the 'ignore' button to close the notification
            text   : localize('Your web browser ([_1]) is out of date and may affect your trading experience. Proceed at your own risk. [_2]Update browser[_3]',
                ['{brow_name}', '<a href="https://www.whatbrowser.org/" target="_blank">', '</a>']),
            reminder: 0, // show all the time
        };
        if (document.body) {
            document.body.appendChild(createElement('script', { src }));
        }
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Page;
