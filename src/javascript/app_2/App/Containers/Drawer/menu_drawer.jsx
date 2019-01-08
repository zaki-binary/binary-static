import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import {
    DrawerItem,
    DrawerToggle }       from 'App/Components/Elements/Drawer';
import { IconLogout }    from 'Assets/Header/Drawer';
import {
    IconTrade,
    IconPortfolio,
    IconStatement }      from 'Assets/Header/NavBar';
import routes            from 'Constants/routes';
import { requestLogout } from 'Services';
import { connect }       from 'Stores/connect';

const MenuDrawer = ({
    is_dark_mode,
    is_logged_in,
    is_mobile,
    is_portfolio_drawer_on,
    // is_purchase_confirmed,
    is_purchase_locked,
    toggleDarkMode,
    togglePortfolioDrawer,
    togglePurchaseLock,
    // togglePurchaseConfirmation,
}) => (
    <div className='drawer-items-container'>
        <div className='list-items-container'>
            {is_mobile &&
            <React.Fragment>
                <DrawerItem
                    text={localize('Trade')}
                    icon={<IconTrade className='drawer-icon' />}
                    link_to={routes.trade}
                />
                <DrawerItem
                    text={localize('Portfolio')}
                    icon={<IconPortfolio className='drawer-icon' />}
                    link_to={routes.portfolio}
                />
                <DrawerItem
                    text={localize('Statement')}
                    icon={<IconStatement className='drawer-icon' />}
                    link_to={routes.statement}
                />
                <hr />
                <DrawerToggle
                    text={localize('Dark Mode')}
                    toggle={toggleDarkMode}
                    to_toggle={is_dark_mode}
                />
                {/* Disabled until design is ready
                <DrawerToggle
                    text={localize('Purchase Confirmation')}
                    toggle={togglePurchaseConfirmation}
                    to_toggle={is_purchase_confirmed}
                />
                */}
                <DrawerToggle
                    text={localize('Purchase Lock')}
                    toggle={togglePurchaseLock}
                    to_toggle={is_purchase_locked}
                />
            </React.Fragment>}
        </div>
        {!!(is_logged_in && is_mobile) &&
        <div className='drawer-footer'>
            <DrawerItem
                icon={<IconLogout className='drawer-icon' />}
                text={localize('Logout')}
                custom_action={() => {
                    if (is_portfolio_drawer_on) {
                        togglePortfolioDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
                    }
                    requestLogout();
                }}
            />
        </div>
        }
    </div>
);

MenuDrawer.propTypes = {
    is_dark_mode              : PropTypes.bool,
    is_logged_in              : PropTypes.bool,
    is_mobile                 : PropTypes.bool,
    is_portfolio_drawer_on    : PropTypes.bool,
    is_purchase_confirmed     : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    toggleDarkMode            : PropTypes.func,
    togglePortfolioDrawer     : PropTypes.func,
    togglePurchaseConfirmation: PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
};

export default connect(
    ({ client, ui }) => ({
        is_logged_in              : client.is_logged_in,
        is_dark_mode              : ui.is_dark_mode_on,
        is_mobile                 : ui.is_mobile,
        is_portfolio_drawer_on    : ui.is_portfolio_drawer_on,
        is_purchase_confirmed     : ui.is_purchase_confirm_on,
        is_purchase_locked        : ui.is_purchase_lock_on,
        toggleDarkMode            : ui.toggleDarkMode,
        togglePortfolioDrawer     : ui.togglePortfolioDrawer,
        togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
        togglePurchaseLock        : ui.togglePurchaseLock,
    }),
)(MenuDrawer);
