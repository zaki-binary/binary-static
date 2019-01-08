import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const ToggleButton = ({ style, toggled }) => {
    const toggle_style = style || 'toggle-button';
    const icon_class = classNames(toggle_style, {
        'toggled': toggled,
    });

    return (
        <div className={icon_class} />
    );
};

ToggleButton.propTypes = {
    style  : PropTypes.string,
    toggled: PropTypes.bool,
};

export default ToggleButton;
