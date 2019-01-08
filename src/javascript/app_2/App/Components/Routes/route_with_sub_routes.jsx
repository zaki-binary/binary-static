import React               from 'react';
import {
    Redirect,
    Route }                from 'react-router-dom';
import { redirectToLogin } from '_common/base/login';
import routes              from 'Constants/routes';
import GTM                 from 'Utils/gtm';
import LoginPrompt         from '../Elements/login_prompt.jsx';
import { default_title }   from '../../Constants/app_config';

const RouteWithSubRoutes = route => {
    const renderFactory = props => {
        let result = null;
        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else {
            result = (
                (route.is_authenticated && !route.is_logged_in) ?
                    <LoginPrompt IconComponent={route.icon_component} onLogin={redirectToLogin} />
                    :
                    <route.component {...props} routes={route.routes} />
            );
        }

        const title = route.title ? `${route.title} | ` : '';
        document.title = `${ title }${ default_title }`;
        GTM.pushDataLayer({ event: 'page_load' });
        return result;
    };

    return <Route
        exact={route.exact}
        path={route.path}
        render={renderFactory}
    />;
};

export default RouteWithSubRoutes;
