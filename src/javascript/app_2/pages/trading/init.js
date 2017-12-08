const State        = require('../../../_common/storage').State;
const mdcDrawer    = require('@material/drawer');
const mdcDialog    = require('@material/dialog');
// const mdcTextField = require('@material/textfield');
// const mdcSelect = require('@material/select');
// const mdcRadio = require('@material/radio');

const Trading = (() => {
    const onLoad = () => {
        State.set('is_trading_2', true);
        const MDCTemporaryDrawer = mdcDrawer.MDCTemporaryDrawer;
        const drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-temporary-drawer'));
        const notify_drawer = new MDCTemporaryDrawer(document.querySelector('.notifications-list'));
        document.querySelector('.menu-toggle').addEventListener('click', (evt) => {
            evt.preventDefault();
            drawer.open = true;
        });
        document.querySelector('.menu-close').addEventListener('click', (evt) => {
            evt.preventDefault();
            if(drawer.open) drawer.open = false;
        });
        document.querySelector('.notifications-toggle').addEventListener('click', (evt) => {
            evt.preventDefault();
            notify_drawer.open = true;
        });
        document.querySelector('.notifications-close').addEventListener('click', (evt) => {
            evt.preventDefault();
            if(notify_drawer.open) notify_drawer.open = false;
        });
        // const amountField = new mdcTextField.MDCTextField(document.querySelector('.amount'));
        // const textField = new mdcTextField.MDCTextField(document.querySelector('.text'));
        const dialog_1 = new mdcDialog.MDCDialog(document.querySelector('#modal-1'));

        dialog_1.listen('MDCDialog:accept', () => {
            // console.log('confirm');
        });

        dialog_1.listen('MDCDialog:cancel', () => {
            // console.log('discard');
        });

        document.querySelector('#modal-popup-1').addEventListener('click', (evt) => {
            dialog_1.lastFocusedTarget = evt.target;
            dialog_1.show();
        });

        const dialog_2 = new mdcDialog.MDCDialog(document.querySelector('#modal-2'));

        dialog_2.listen('MDCDialog:accept', () => {
            // console.log('confirm');
        });

        dialog_2.listen('MDCDialog:cancel', () => {
            // console.log('discard');
        });

        document.querySelector('#modal-popup-2').addEventListener('click', (evt) => {
            dialog_2.lastFocusedTarget = evt.target;
            dialog_2.show();
        });
    };

    const onUnload = () => {
        State.remove('is_trading_2');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Trading;
