const State = require('../../../_common/storage').State;
const mdcDrawer = require('@material/drawer');

const Trading = (() => {
    const onLoad = () => {
        State.set('is_trading_2', true);
        const MDCTemporaryDrawer = mdcDrawer.MDCTemporaryDrawer;
        const drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-temporary-drawer'));
        document.querySelector('.menu-toggle').addEventListener('click', () => drawer.open = true);
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
