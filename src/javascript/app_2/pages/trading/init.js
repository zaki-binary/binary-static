const State       = require('../../../_common/storage').State;
const mdcDrawer   = require('@material/drawer');
const mdcDialog   = require('@material/dialog');
// const mdcToolbar = require('@material/toolbar');
// const mdcTabs = require('@material/tabs');
const mdcTextField = require('@material/textfield');
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
        document.querySelector('.notifications-toggle').addEventListener('click', (evt) => {
            evt.preventDefault();
            notify_drawer.open = true;
        });
        const amountField = new mdcTextField.MDCTextField(document.querySelector('.amount'));
        const textField = new mdcTextField.MDCTextField(document.querySelector('.text'));
        const dialog = new mdcDialog.MDCDialog(document.querySelector('#mdc-dialog-with-list'));

        console.log(amountField);
        console.log(textField);

        dialog.listen('MDCDialog:accept', () => {
            console.log('confirm');
        });

        dialog.listen('MDCDialog:cancel', () => {
            console.log('discard');
        });

        document.querySelector('#modal-popup').addEventListener('click', (evt) => {
            dialog.lastFocusedTarget = evt.target;
            dialog.show();
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
