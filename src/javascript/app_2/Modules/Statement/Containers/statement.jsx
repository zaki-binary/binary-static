import classnames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { withRouter }                 from 'react-router-dom';
import DataTable                      from 'App/Components/Elements/DataTable';
import { getContractPath }            from 'App/Components/Routes/helpers';
import { connect }                    from 'Stores/connect';
import Filter                         from './statement_filter.jsx';
import StatementCardList              from '../Components/statement_card_list.jsx';
import EmptyStatementMessage          from '../Components/empty_statement_message.jsx';
import { getTableColumnsTemplate }    from '../Constants/data_table_constants';
import Loading                        from '../../../../../templates/_common/components/loading.jsx';

class Statement extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            has_selected_date,
            data,
            is_empty,
            is_loading,
            is_mobile,
            is_tablet,
            error,
            handleScroll,
        } = this.props;

        if (error) return <p>{error}</p>;

        const columns = getTableColumnsTemplate();
        const should_show_cards = is_mobile || is_tablet;

        const renderGUI = () => (
            <React.Fragment>
                {
                    is_empty &&
                    <EmptyStatementMessage has_selected_date={has_selected_date} />
                }
                {
                    is_loading &&
                    <Loading />
                }
            </React.Fragment>
        );

        return (
            <div className={classnames('statement container', { 'statement--card-view': should_show_cards })}>
                <Filter use_native_pickers={should_show_cards} />
                <div className='statement__content'>
                    {
                        should_show_cards ?
                            <React.Fragment>
                                <StatementCardList
                                    data={data}
                                    onScroll={handleScroll}
                                >
                                    {renderGUI()}
                                </StatementCardList>
                            </React.Fragment>
                            :
                            <DataTable
                                data_source={data}
                                columns={columns}
                                onScroll={handleScroll}
                                getRowLink={(row_obj) => row_obj.id ? getContractPath(row_obj.id) : undefined}
                                is_empty={is_empty}
                            >
                                {renderGUI()}
                            </DataTable>
                    }
                </div>
            </div>
        );
    }
}

Statement.propTypes = {
    data             : MobxPropTypes.arrayOrObservableArray,
    error            : PropTypes.string,
    handleScroll     : PropTypes.func,
    has_selected_date: PropTypes.bool,
    history          : PropTypes.object,
    is_empty         : PropTypes.bool,
    is_loading       : PropTypes.bool,
    is_mobile        : PropTypes.bool,
    is_tablet        : PropTypes.bool,
    onMount          : PropTypes.func,
    onUnmount        : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        is_empty         : modules.statement.is_empty,
        has_selected_date: modules.statement.has_selected_date,
        data             : modules.statement.data,
        is_loading       : modules.statement.is_loading,
        error            : modules.statement.error,
        onMount          : modules.statement.onMount,
        onUnmount        : modules.statement.onUnmount,
        handleScroll     : modules.statement.handleScroll,
        is_mobile        : ui.is_mobile,
        is_tablet        : ui.is_tablet,
    })
)(withRouter(Statement));
