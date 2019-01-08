import { action, flow }     from 'mobx';
import { setCurrencies }    from '_common/base/currency_base';
import Login                from '_common/base/login';
import ServerTime           from '_common/base/server_time';
import BinarySocket         from '_common/base/socket_base';
import { State }            from '_common/storage';
import { getPropertyValue } from '_common/utility';
import { requestLogout }    from './logout';
import WS                   from './ws_methods';

let client_store,
    common_store;

// TODO: update commented statements to the corresponding functions from app_2
const BinarySocketGeneral = (() => {
    const onDisconnect = () => {
        common_store.setIsSocketOpened(false);
    };

    const onOpen = (is_ready) => {
        // Header.hideNotification();
        if (is_ready) {
            if (!Login.isLoginPages()) {
                if (!client_store.is_valid_login) {
                    requestLogout();
                    return;
                }
                WS.subscribeWebsiteStatus(ResponseHandlers.websiteStatus);
            }
            ServerTime.init(action('setTime', () => { common_store.server_time = ServerTime.get(); }));
            common_store.setIsSocketOpened(true);
        }
    };

    const onMessage = (response) => {
        handleError(response);
        // Header.hideNotification('CONNECTION_ERROR');
        switch (response.msg_type) {
            case 'authorize':
                if (response.error) {
                    const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if (getPropertyValue(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                        // Dialog.alert({ id: 'authorize_error_alert', message: response.error.message });
                    }
                    requestLogout();
                } else if (!Login.isLoginPages() && !/authorize/.test(State.get('skip_response'))) {
                    if (response.authorize.loginid !== client_store.loginid) {
                        requestLogout();
                    } else {
                        client_store.responseAuthorize(response);
                        WS.subscribeBalance(ResponseHandlers.balance);
                        WS.getSettings();
                        WS.getAccountStatus();
                        WS.payoutCurrencies();
                        WS.mt5LoginList();
                        setResidence(
                            response.authorize.country ||
                            client_store.accounts[client_store.loginid].residence
                        );
                        if (!client_store.is_virtual) {
                            WS.getSelfExclusion();
                        }
                        BinarySocket.sendBuffered();
                        if (/bch/i.test(response.authorize.currency) && !client_store.accounts[client_store.loginid].accepted_bch) {
                            // showPopup({
                            //     url        : urlFor('user/warning'),
                            //     popup_id   : 'warning_popup',
                            //     form_id    : '#frm_warning',
                            //     content_id : '#warning_content',
                            //     validations: [{ selector: '#chk_accept', validations: [['req', { hide_asterisk: true }]] }],
                            //     onAccept   : () => { Client.set('accepted_bch', 1); },
                            // });
                        }
                    }
                }
                break;
            case 'landing_company':
                // Header.upgradeMessageVisibility();
                break;
            case 'get_self_exclusion':
                // SessionDurationLimit.exclusionResponseHandler(response);
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    client_store.setEmail(response.get_settings.email);
                    // GTM.eventHandler(response.get_settings);
                    // if (response.get_settings.is_authenticated_payment_agent) {
                    //     $('#topMenuPaymentAgent').setVisibility(1);
                    // }
                }
                break;
            case 'payout_currencies':
                client_store.responsePayoutCurrencies(response.payout_currencies);
                break;
            // no default
        }
    };

    const setResidence = (residence) => {
        if (residence) {
            client_store.setResidence(residence);
            WS.landingCompany(residence);
        }
    };

    const setBalance = flow(function* (balance) {
        yield BinarySocket.wait('website_status');
        client_store.setBalance(balance);
    });

    const handleError = (response) => {
        const msg_type   = response.msg_type;
        const error_code = getPropertyValue(response, ['error', 'code']);
        switch (error_code) {
            case 'WrongResponse':
            case 'InternalServerError':
            case 'OutputValidationFailed': {
                if (msg_type !== 'mt5_login_list') {
                    common_store.setError(true, { message: response.error.message });
                }
                break;
            }
            case 'RateLimit':
                if (msg_type !== 'cashier_password') {
                    common_store.setError(true, { message: 'You have reached the rate limit of requests per second. Please try later.' });
                }
                break;
            case 'InvalidAppID':
                common_store.setError(true, { message: response.error.message });
                break;
            case 'DisabledClient':
                common_store.setError(true, { message: response.error.message });
                break;
            // no default
        }
    };

    const init = (store) => {
        client_store = store.client;
        common_store = store.common;

        return {
            onDisconnect,
            onOpen,
            onMessage,
        };
    };

    return {
        init,
        setBalance,
    };
})();

export default BinarySocketGeneral;

const ResponseHandlers = (() => {
    let is_available = false;
    const websiteStatus = (response) => {
        if (response.website_status) {
            is_available = /^up$/i.test(response.website_status.site_status);
            if (is_available && !BinarySocket.availability()) {
                window.location.reload();
                return;
            }
            if (response.website_status.message) {
                // Footer.displayNotification(response.website_status.message);
            } else {
                // Footer.clearNotification();
            }
            BinarySocket.availability(is_available);
            setCurrencies(response.website_status);
        }
    };

    const balance = (response) => {
        if (!response.error){
            BinarySocketGeneral.setBalance(response.balance.balance);
        }
    };

    return {
        websiteStatus,
        balance,
    };
})();
