import { observer }        from 'mobx-react';
import PropTypes           from 'prop-types';
import React               from 'react';
import { IconBarrierUp }   from 'Assets/Trading/Barriers/icon_barrier_up.jsx';
import { IconBarrierDown } from 'Assets/Trading/Barriers/icon_barrier_down.jsx';
import Fieldset            from 'App/Components/Form/fieldset.jsx';
import InputField          from 'App/Components/Form/input_field.jsx';
import { localize }        from '_common/localize';

const Barrier = ({
    barrier_1,
    barrier_2,
    barrier_count,
    is_minimized,
    onChange,
    validation_errors,
}) =>  {
    const barrier_title = barrier_count === 1 ? localize('Barrier') : localize('Barriers');

    if (is_minimized) {
        if (barrier_count !== 2) {
            return (
                <div className='fieldset-minimized barrier1'>
                    <span className='icon barriers' />
                    {barrier_1}
                </div>
            );
        }
        return (
            <React.Fragment>
                <div className='fieldset-minimized barrier1'>
                    <span className='icon barriers' />
                    {barrier_1}
                </div>
                <div className='fieldset-minimized barrier2'>
                    <span className='icon barriers' />
                    {barrier_2}
                </div>
            </React.Fragment>
        );
    }
    return (
        <Fieldset
            className='barriers'
            header={barrier_title}
        >
            <InputField
                type='number'
                name='barrier_1'
                value={barrier_1}
                className={barrier_count === 2 ? 'multiple' : 'single'}
                onChange={onChange}
                error_messages = {validation_errors.barrier_1 || []}
                is_float
                is_signed
            />

            {barrier_count === 2 &&
                <React.Fragment>
                    <InputField
                        type='number'
                        name='barrier_2'
                        value={barrier_2}
                        className='multiple'
                        onChange={onChange}
                        error_messages = {validation_errors.barrier_2}
                        is_float
                        is_signed
                    />
                    <IconBarrierUp className='up' />
                    <IconBarrierDown className='down' />
                </React.Fragment>
            }
        </Fieldset>
    );
};

Barrier.propTypes = {
    barrier_1        : PropTypes.string,
    barrier_2        : PropTypes.string,
    barrier_count    : PropTypes.number,
    is_minimized     : PropTypes.bool,
    onChange         : PropTypes.func,
    validation_errors: PropTypes.object,
};

export default observer(Barrier);
