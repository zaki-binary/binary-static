import {
    action,
    observable }           from 'mobx';
import moment              from 'moment';
import { currentLanguage } from 'Utils/Language/index';
import BaseStore           from './base_store';

export default class CommonStore extends BaseStore {
    @observable server_time      = moment.utc();
    @observable current_language = currentLanguage;
    @observable has_error        = false;

    @observable error = {
        type   : 'info',
        message: '',
    };

    @observable network_status    = {};
    @observable is_network_online = false;
    @observable is_socket_opened  = false;

    @action.bound
    setIsSocketOpened(is_socket_opened) {
        this.is_socket_opened = is_socket_opened;
    }

    @action.bound
    setError(has_error, error) {
        this.has_error = has_error;
        this.error     = {
            type   : error ? error.type : 'info',
            message: error ? error.message : '',
        };
    }

    @action.bound
    showError(message) {
        this.setError(true, {
            message,
            type: 'error',
        });
    }
}
