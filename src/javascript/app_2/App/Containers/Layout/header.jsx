import PropTypes                from 'prop-types';
import React                    from 'react';
import { withRouter }           from 'react-router';
import { formatMoney }          from '_common/base/currency_base';
import {
    AccountInfo,
    LoginButton,
    InstallPWAButton,
    MenuLinks,
    ToggleMenuDrawer,
    ToggleNotificationsDrawer } from 'App/Components/Layout/Header';
import header_links             from 'App/Constants/header_links';
import { connect }              from 'Stores/connect';

const Header = ({
    account_type,
    balance,
    can_upgrade,
    currency,
    hideInstallButton,
    is_acc_switcher_on,
    is_install_button_visible,
    is_logged_in,
    is_mobile,
    loginid,
    onClickUpgrade,
    pwa_prompt_event,
    setPWAPromptEvent,
    showInstallButton,
    toggleAccountsDialog,
}) => {

    window.addEventListener('beforeinstallprompt', e => {
        console.log('Going to show the installation prompt'); // eslint-disable-line no-console

        e.preventDefault();

        setPWAPromptEvent(e);
        showInstallButton();

    });

    return (
        <header className='header'>
            <div className='menu-items'>
                <div className='menu-left'>
                    {is_mobile && <ToggleMenuDrawer />}
                    <MenuLinks items={header_links} />
                </div>
                <div className='menu-right'>
                    <div className='acc-balance-container'>
                        { is_install_button_visible && is_logged_in &&
                            <InstallPWAButton
                                prompt_event={pwa_prompt_event}
                                onClick={hideInstallButton}
                            />
                        }
                        { is_logged_in ?
                            <React.Fragment>
                                <AccountInfo
                                    account_type={account_type}
                                    balance={formatMoney(currency, balance, true)}
                                    is_upgrade_enabled={can_upgrade}
                                    onClickUpgrade={onClickUpgrade}
                                    currency={currency}
                                    loginid={loginid}
                                    is_dialog_on={is_acc_switcher_on}
                                    toggleDialog={toggleAccountsDialog}
                                />
                            </React.Fragment>
                            :
                            <LoginButton />
                        }
                    </div>
                </div>
                <ToggleNotificationsDrawer />
            </div>
        </header>
    );
};

Header.propTypes = {
    account_type             : PropTypes.string,
    balance                  : PropTypes.string,
    can_upgrade              : PropTypes.bool,
    currency                 : PropTypes.string,
    hideInstallButton        : PropTypes.func,
    is_acc_switcher_on       : PropTypes.bool,
    is_dark_mode             : PropTypes.bool, // TODO: add dark theme handler
    is_install_button_visible: PropTypes.bool,
    is_logged_in             : PropTypes.bool,
    is_mobile                : PropTypes.bool,
    loginid                  : PropTypes.string,
    onClickUpgrade           : PropTypes.func, // TODO: add click handler
    pwa_prompt_event         : PropTypes.object,
    setPWAPromptEvent        : PropTypes.func,
    showInstallButton        : PropTypes.func,
    toggleAccountsDialog     : PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <MenuLinks /> from being blocked
export default withRouter(connect(
    ({ client, ui }) => ({
        account_type             : client.account_title,
        balance                  : client.balance,
        can_upgrade              : client.can_upgrade,
        currency                 : client.currency,
        is_logged_in             : client.is_logged_in,
        loginid                  : client.loginid,
        hideInstallButton        : ui.hideInstallButton,
        is_acc_switcher_on       : ui.is_accounts_switcher_on,
        is_dark_mode             : ui.is_dark_mode_on,
        is_install_button_visible: ui.is_install_button_visible,
        is_mobile                : ui.is_mobile,
        pwa_prompt_event         : ui.pwa_prompt_event,
        setPWAPromptEvent        : ui.setPWAPromptEvent,
        showInstallButton        : ui.showInstallButton,
        toggleAccountsDialog     : ui.toggleAccountsDialog,
    })
)(Header));
