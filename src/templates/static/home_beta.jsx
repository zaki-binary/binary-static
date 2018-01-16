import React from 'react';
import FormVerifyEmail from '../_common/includes/form_verify_email.jsx';
import SeparatorLine from '../_common/components/separator_line.jsx';
import { TabContainer, TabContentContainer, TabsSubtabs, TabContent } from  '../_common/components/tabs.jsx';

const PaymentLogo = ({ items }) => items.map((item, inx) => (
    <div key={inx} className='gr-2 gr-4-m gr-padding-30 center-text'>
        <img className='gr-12 gr-centered' src={it.url_for(`images/pages/home-beta/payment/${item}.svg`)} />
    </div>
));

const Arrows = ({ direction, parent }) => (
    <div className='align-self-center gr-1 gr-hide-m'>
        <img
            className={`go-${direction} gr-10 gr-12-p gr-no-gutter-p gr-centered`}
            data-parent={parent}
            src={it.url_for(`images/pages/home-beta/arrow_${direction}.svg`)}
        />
    </div>
);

const ArrowsMobile = ({ direction, parent }) => (
    <div className='align-self-center gr-2 gr-hide gr-show-m gr-no-gutter'>
        <img
            className={`go-${direction} gr-5 gr-no-gutter gr-centered`}
            data-parent={parent}
            src={it.url_for(`images/pages/home-beta/arrow_${direction}.svg`)}
        />
    </div>
);

const MarketsTabContent = ({ text, header, image }) => (
    <div className='gr-row gr-row-align-middle'>
        <Arrows parent='market_tabs' direction='left' />
        <div className='gr-10 gr-12-m'>
            <div className='gr-row'>
                <div className='gr-6 gr-12-m center-text-m order-2-m'>
                    <div className='gr-10-m gr-centered gr-gutter'>
                        <div className='gr-row'>
                            <ArrowsMobile parent='market_tabs' direction='left' />
                            <strong className='align-self-center gr-centered-m'>{header}</strong>
                            <ArrowsMobile parent='market_tabs' direction='right' />
                        </div>
                    </div>
                    <p>{text}</p>
                </div>
                <div className='gr-6 gr-12-m center-text'>
                    <img className='responsive' src={it.url_for(image)} />
                </div>
            </div>
        </div>
        <Arrows parent='market_tabs' direction='right' />
    </div>
);

const AccountsListItem = ({ image, list_header, list_text }) => (
    <div className='gr-row gr-padding-10'>
        <div className='gr-2 gr-no-gutter gr-gutter-left-m'>
            <img className='responsive' src={it.url_for(image)} />
        </div>
        <div className='gr-10 gr-no-gutter-right'>
            <strong>{list_header}</strong>
            <p className='hint'>{list_text}</p>
        </div>
    </div>
);

const AccountsTabContent = ({
    header,
    image,
    mobile_header,
    mobile_class,
    image_one,
    image_two,
    image_three,
    list_header_one,
    list_header_two,
    list_header_three,
    list_text_one,
    list_text_two,
    list_text_three,
}) => (
    <React.Fragment>
        <div className='gr-hide-m'>
            <p className='center-text gr-10 gr-no-gutter gr-centered'>{header}</p>
        </div>
        <div className='gr-row gr-padding-30'>
            <Arrows parent='account_tabs' direction='left' />
            <div className='gr-10 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-6 gr-10-m gr-centered align-self-center'>
                        <img className='responsive' src={it.url_for(image)} />
                    </div>
                    <div className={`center-text gr-12 gr-hide gr-show-m ${mobile_class || ''}`}>
                        <div className='gr-8 gr-centered'>
                            <div className='gr-row'>
                                <ArrowsMobile parent='account_tabs' direction='left' />
                                <strong className='align-self-center gr-centered'>{mobile_header}</strong>
                                <ArrowsMobile parent='account_tabs' direction='right' />
                            </div>
                        </div>
                        <div className='gr-12'><p>{header}</p></div>
                    </div>
                    <div className='gr-6 gr-12-m'>
                            <AccountsListItem
                                image={image_one}
                                list_header={list_header_one}
                                list_text={list_text_one}
                            />
                            <AccountsListItem
                                image={image_two}
                                list_header={list_header_two}
                                list_text={list_text_two}
                            />
                            <AccountsListItem
                                image={image_three}
                                list_header={list_header_three}
                                list_text={list_text_three}
                            />
                    </div>
                </div>
            </div>
            <Arrows parent='account_tabs' direction='right' />
        </div>
    </React.Fragment>
);

const AcademySection = ({ image, header, text }) => (
    <div className='gr-4 gr-12-m center-text'>
        <div className='gr-4 gr-3-m gr-centered gr-padding-10'>
            <img className='responsive' src={it.url_for(image)} />
        </div>
        <strong>{header}</strong>
        <p>{text}</p>
    </div>
);

const TabCircles = ({ id, number }) => (
    <div className='gr-hide gr-show-m center-text'>
        <div className='tab-circles' id={id || undefined}>
            { Array.from(new Array(number)).map((x, inx) => (
                <div key={inx} className='tab-circle'></div>
            ))}
        </div>
    </div>
);

const HomeBeta = () => (
    <React.Fragment>
        <div id='banner'>
            <div className='container gr-padding-30'>
                <h1 className='dark center-text gr-padding-20 gr-child'>{it.L('Online Trading with [_1]', `<strong>${it.website_name}</strong>`)}</h1>
                <p className='center-text gr-padding-10'>{it.L('Trade 24/7, even on weekends.')}</p>

                <div className='gr-padding-30 gr-11-m gr-centered'>
                    <FormVerifyEmail
                        className='secondary-bg-color'
                        dark_button
                        email_padding_mobile={12}
                        button_padding_mobile={12}
                        text={it.L('Create Free Account')}
                    />
                </div>
            </div>
        </div>

        <div className='container'>
            <h2 className='center-text gr-padding-10'>{it.L('Trade in the world\'s financial markets')}</h2>
            <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                <TabsSubtabs
                    id='market_tabs'
                    className='gr-padding-20 gr-parent gr-hide-m tab-selector-wrapper'
                    items={[
                        { id: 'binary', text: it.L('Binary options') },
                        { id: 'forex', text: it.L('Forex') },
                        { id: 'cfds', text: it.L('CFDs') },
                        { id: 'metals', text: it.L('Metals') },
                        { id: 'crypto', text: it.L('Crypto') },
                        { id: 'market_tabs_selector', className: 'tab-selector' },
                    ]}
                />
                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='binary'>
                        <MarketsTabContent
                            header={it.L('Binary options')}
                            text={it.L('Options that offer a fixed payout based on a simple yes/no proposition.')}
                            image='images/pages/home-beta/trade/binary.svg'
                        />
                        </TabContent>
                        <TabContent id='forex'>
                            <MarketsTabContent
                                header={it.L('Forex')}
                                text={it.L('Major, minor and exotic currency pairs.')}
                                image='images/pages/home-beta/trade/forex.svg'
                            />
                        </TabContent>
                        <TabContent id='cfds'>
                            <MarketsTabContent
                                header={it.L('CFDs')}
                                text={it.L('CFDs Derivatives that profit by speculating on the movement of underlying assets.')}
                                image='images/pages/home-beta/trade/cfds.svg'
                            />
                        </TabContent>
                        <TabContent id='metals'>
                            <MarketsTabContent
                                header={it.L('Metals')}
                                text={it.L('Precious metal pairs including gold and platinum.')}
                                image='images/pages/home-beta/trade/metals.svg'
                            />
                        </TabContent>
                        <TabContent id='crypto'>
                            <MarketsTabContent
                                header={it.L('Cryptocurrencies')}
                                text={it.L('Cryptocurrency pairs including Bitcoin, Ethereum, and Litecoin.')}
                                image='images/pages/home-beta/trade/crypto.svg'
                            />
                        </TabContent>
                    </TabContentContainer>
                </div>
                <TabCircles number={5} id='market_tabs_circles' />
            </TabContainer>
            <h3 className='center-text gr-padding-30'>{it.L('Choose from 100+ tradable instruments, backed by award-winning technology and innovation since 2000.')}</h3>
        </div>

        <div className='gr-padding-10 fill-bg-color'>
            <div className='container gr-padding-20'>
                <h3 className='center-text no-margin'>{it.L('Commitment to the highest ethical standards and regulatory compliance')}</h3>
            </div>
        </div>

        <div className='container gr-padding-30'>
            <h2 className='center-text'>{it.L('Diverse platforms and account types')}</h2>
            <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                <TabsSubtabs
                    id='account_tabs'
                    className='gr-padding-20 gr-parent gr-hide-m tab-selector-wrapper'
                    items={[
                        { id: 'binary_options', text: it.L('Binary Options') },
                        { id: 'mt5', text: it.L('MetaTrader 5') },
                        { id: 'account_tabs_selector', className: 'tab-selector' },
                    ]}
                />
                <div className='tab-content'>
                    <TabContentContainer>
                        <TabContent id='binary_options'>
                            <AccountsTabContent
                                header={it.L('Trade binary options on a wide range of web and mobile apps. Each comes with unique strengths that complement a variety of trading strategies.')}
                                mobile_header={it.L('Binary Options')}
                                image='images/pages/home-beta/binary_options.svg'
                                image_one='images/pages/home-beta/icons/demo.svg'
                                list_header_one={it.L('Virtual Account')}
                                list_text_one={it.L('Practice account with replenishable USD 10,000 virtual credit.')}
                                image_two='images/pages/home-beta/icons/real.svg'
                                list_header_two={it.L('Real Account')}
                                list_text_two={it.L('Real-money accounts with your choice of fiat currency.')}
                                image_three='images/pages/home-beta/icons/crypto.svg'
                                list_header_three={it.L('Crypto Account')}
                                list_text_three={it.L('Real-money accounts with your choice of cryptocurrency.')}
                            />
                        </TabContent>
                        <TabContent id='mt5'>
                            <AccountsTabContent
                                header={it.L('Trade Forex and CFD assets with up to 1,000:1 leverage on the world\'s most popular institutional multi-asset platform.')}
                                mobile_class='padding-top-20'
                                mobile_header={it.L('MetaTrader 5')}
                                image='images/pages/home-beta/MT5.svg'
                                image_one='images/pages/home-beta/icons/demo.svg'
                                list_header_one={it.L('MT5 Demo')}
                                list_text_one={it.L('Practice account with replenishable USD 5,000 virtual credit.')}
                                image_two='images/pages/home-beta/icons/mt5_financial.svg'
                                list_header_two={it.L('MT5 Financial')}
                                list_text_two={it.L('MT5 real-money account for Forex and CFDs.')}
                                image_three='images/pages/home-beta/icons/mt5_volatility.svg'
                                list_header_three={it.L('MT5 Volatility')}
                                list_text_three={it.L('MT5 real-money account for Volatility Indices only.')}
                            />
                        </TabContent>
                    </TabContentContainer>
                </div>
                <TabCircles number={2} id='account_tabs_circles' />
            </TabContainer>

            <div className='center-text gr-padding-20 gr-parent'>
                <h3 className='center-text gr-padding-20 gr-parent'>{it.L('Choose the platforms and accounts you need, based on your personal trading style')}</h3>
                <a className='button-secondary' href={it.url_for('platforms')}><span>{it.L('View our platforms')}</span></a>
            </div>
        </div>

        <div className='gr-padding-10 fill-bg-color'>
            <div className='container gr-padding-20'>
                <div className='gr-row'>
                    <div className='gr-3 gr-12-m align-self-center center-text-m gr-padding-10'>
                        <h3 className='no-margin'>{it.L('Award-winning trading excellence')}</h3>
                    </div>
                    <div className='gr-9 gr-12-m align-self-center'>
                        <div className='gr-row gr-row-align-center'>
                            <div className='gr-1 gr-hide-m border-right'></div>
                            <div className='gr-2 gr-4-m align-self-center gr-padding-10'><img className='responsive' src={it.url_for('images/pages/home-beta/awards/TW2.svg')} /></div>
                            <div className='gr-2 gr-4-m align-self-center gr-padding-10'><img className='responsive' src={it.url_for('images/pages/home-beta/awards/GBAF.svg')} /></div>
                            <div className='gr-2 gr-4-m align-self-center gr-padding-10'><img className='responsive' src={it.url_for('images/pages/home/awards-opwa.svg')} /></div>
                            <div className='gr-2 gr-4-m align-self-center gr-padding-10'><img className='responsive' src={it.url_for('images/pages/home-beta/awards/MenaFxPro.svg')} /></div>
                            <div className='gr-2 gr-4-m align-self-center gr-padding-10'><img className='responsive' src={it.url_for('images/pages/home-beta/awards/EGR.svg')} /></div>
                            <div className='gr-1 gr-hide-m'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='container gr-padding-30 gr-child'>
            <h2 className='center-text gr-padding-20'>{it.L('[_1] Academy', it.website_name)}</h2>
            <p className='center-text'>{it.L('Learn to be a better trader and keep up with the latest news and trends in financial trading - all for free.')}</p>
            <div className='gr-row'>
                <AcademySection
                    image='images/pages/home-beta/icons/webinars.svg'
                    header={it.L('Interactive Webinars')}
                    text={it.L('Free training sessions by professional traders.')}
                />
                <AcademySection
                    image='images/pages/home-beta/icons/daily.svg'
                    header={it.L('Daily market reports')}
                    text={it.L('Daily insights into markets around the world.')}
                />
                <AcademySection
                    image='images/pages/home-beta/icons/video.svg'
                    header={it.L('Ebooks, videos, and more')}
                    text={it.L('Expert analysis and learning resources.')}
                />
            </div>
            <div className='center-text gr-padding-30'>
                <a className='button-secondary' href='https://academy.binary.com' target='_blank' rel='noopener noreferrer'>
                    <span>{it.L('Learn more')}</span>
                </a>
            </div>

            <SeparatorLine className='gr-padding-30' show_mobile />

            <div id='payment_methods'>
                <div className='gr-12 gr-padding-20'>
                    <h2 className='center-text'>{it.L('Payment methods')}</h2>
                    <p className='center-text'>{it.L('We support hundreds of deposit and withdrawal options, including Bitcoin.')}</p>

                    <div className='gr-12 gr-padding-30'>
                        <a href={it.url_for('cashier/payment_methods')}>
                            <div className='gr-row gr-row-align-center'>
                                <PaymentLogo
                                    items={[
                                        'visa',
                                        'mastercard',
                                        'bank_transfer',
                                        'internet_bank_transfer',
                                        'western_union',
                                        'internet_banking',
                                        'neteller',
                                        'okpay',
                                        'fasapay',
                                        'perfect_money',
                                        'skrill',
                                        'ecopayz',
                                        'qiwi',
                                        'ethereum_black',
                                        'bitcoin',
                                        'bitcoin_cash',
                                        'litecoin',
                                        'union_pay',
                                    ]}
                                />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default HomeBeta;
