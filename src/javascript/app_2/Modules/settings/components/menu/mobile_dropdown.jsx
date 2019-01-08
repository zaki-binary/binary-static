import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { Switch, Route } from 'react-router-dom';
import MenuItem          from './menu_item.jsx';

class MobileDropdown extends React.Component {
    state = {
        is_open: false,
    };

    toggleOpen = () => {
        this.setState({
            is_open: !this.state.is_open,
        });
    };

    render() {
        const { all_items, children } = this.props;
        const { is_open }             = this.state;
        return (
            <div className={classNames('mobile-dropdown', { 'mobile-dropdown--open': is_open })}>
                <div className='mobile-dropdown__button' onClick={this.toggleOpen}>
                    <Switch>
                        {
                            all_items.map(({ title, description, path, Icon }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    render={() =>
                                        <MenuItem
                                            title={title}
                                            description={description}
                                            Icon={Icon}
                                        />
                                    }
                                />
                            ))
                        }
                    </Switch>
                    <span className='select-arrow' />
                </div>
                <div className='mobile-dropdown__menu'>{children}</div>
            </div>
        );
    }
}

MobileDropdown.propTypes = {
    all_items: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
            Icon       : PropTypes.element,
            path       : PropTypes.string,
            title      : PropTypes.string,
        }),
    ),
    children: PropTypes.element,
};

export default MobileDropdown;
