const Client                  = require('../client');
const setCurrencies           = require('../../../_common/base/currency_base').setCurrencies;
const { api, expect, setURL } = require('../../../_common/__tests__/tests_common');
const State                   = require('../../../_common/storage').State;
const Url                     = require('../../../_common/url');

describe('Client', () => {
    const landing_company = { landing_company: { financial_company: { name: 'Binary Investments (Europe) Ltd', shortcode: 'maltainvest' }, gaming_company: { name: 'Binary (Europe) Ltd', shortcode: 'malta' } }, msg_type: 'landing_company' };
    const authorize       = { authorize: { upgradeable_landing_companies: [] }};

    describe('.getUpgradeInfo()', () => {
        it('returns false if client can\'t upgrade', () => {
            State.set(['response', 'authorize'], authorize);
            expect(Client.getUpgradeInfo().can_upgrade).to.eq(false);
        });
        it('returns as expected for accounts that can upgrade to real', () => {
            ['svg', 'malta', 'iom'].forEach((lc) => {
                State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ lc ]);
                const upgrade_info = Client.getUpgradeInfo();
                expect(upgrade_info.upgrade_links[lc]).to.eq('new_account/realws');
                expect(upgrade_info.is_current_path).to.eq(false);
            });
        });
        it('returns as expected for accounts that can upgrade to financial', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ 'maltainvest' ]);
            const upgrade_info = Client.getUpgradeInfo();
            expect(upgrade_info.upgrade_links.maltainvest).to.eq('new_account/maltainvestws');
            expect(upgrade_info.is_current_path).to.eq(false);
        });
        it('returns as expected for multi account opening', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ 'svg' ]);
            Client.set('landing_company_shortcode', 'svg');
            const upgrade_info = Client.getUpgradeInfo();
            expect(upgrade_info.upgrade_links.svg).to.eq(undefined);
            expect(upgrade_info.is_current_path).to.eq(false);
        });
    });

    describe('.defaultRedirectUrl()', () => {
        it('redirects to trading for logged-in clients', () => {
            expect(Client.defaultRedirectUrl()).to.eq(Url.urlFor('trading'));
        });
    });

    after(() => {
        setURL(`${Url.websiteUrl()}en/home.html`);
        Client.clearAllAccounts();
    });
});
