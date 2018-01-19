import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';
import { TabContainer, TabContent, TabContentContainer, TabsSubtabs } from '../../_common/components/tabs.jsx';

const GetStartedSection = ({ link, hash, image, header, text }) => {
    const href = `${it.url_for(link)}#${hash}`;
    return (
        <div className='gr-6 gr-12-m gr-padding-30 gr-child'>
            <div className='gr-row'>
                <div className='gr-4'>
                    <a href={href}>
                        <img className='responsive' src={it.url_for(`images/pages/get-started-beta/${image}.svg`)} />
                    </a>
                </div>
                <div className='gr-8'>
                    <a href={href}><h3>{header}</h3></a>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

const GetStartedSectionWrapper = ({ section_id, section_header, section_description, children }) => (
    <React.Fragment>
        <div className='gr-padding-30 gr-parent' id={section_id}>
            <div className='center-text'>
                <h2>{section_header}</h2>
                <p>{section_description}</p>
            </div>
            {children}
        </div>
        <SeparatorLine invisible className='gr-padding-30' />
    </React.Fragment>
);

const Index = () => (
    <div className='static_full get-started-beta'>
        <h1 className='center-text'>{it.L('Get Started')}</h1>
        <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
            <TabsSubtabs id='get_started_tabs' className='gr-padding-20 gr-parent tab-selector-wrapper' items={[
                { id: 'binary', text: it.L('Binary Options') },
                { id: 'mt5',    text: it.L('MetaTrader 5') },
                { id: 'get_started_tabs_selector', className: 'tab-selector' },
            ]} />
            <div className='tab-content'>
                <TabContentContainer>
                    <TabContent id='binary'>
                        <div className='gr-row' id='binary-options'>
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='what-are-binary-options'
                                image='binary-options/what-are-binary-option'
                                header={it.L('What are binary options')}
                                text={it.L('Understand the simple idea behind binary options and their advantages over other financial instruments.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='range-of-markets'
                                image='binary-options/range-of-markets'
                                header={it.L('Range of markets')}
                                text={it.L('Trade binary options on a wide range of underlying markets with limited risk.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='types-of-trades'
                                image='binary-options/types-of-trades'
                                header={it.L('Types of trades')}
                                text={it.L('Learn about the five types of trades that can help you execute your trading strategy on rising, falling, and even sideways markets.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='how-to-trade-binary'
                                image='binary-options/how-to-trade-binary'
                                header={it.L('How to trade binary options')}
                                text={it.L('Learn how to trade with our award-winning binary options platform in this simple step-by-step guide.')}
                            />
                            <GetStartedSection
                                link='get-started/binary-options'
                                hash='glossary'
                                image='binary-options/glossary'
                                header={it.L('Glossary')}
                                text={it.L('Check out some technical terms before you start.')}
                            />
                        </div>
                    </TabContent>
                    <TabContent id='mt5'>
                        <GetStartedSectionWrapper
                            section_id='forex'
                            section_header={it.L('Forex')}
                            section_description={it.L('The Foreign Exchange Market (Forex) is the world\'s largest and most liquid market – where anyone can buy, sell, and exchange currencies.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='what-forex-trading'
                                    image='mt5/what-forex-trading'
                                    header={it.L('What is Forex trading')}
                                    text={it.L('New to Forex? We explain the basics of the world\'s largest and most liquid market.')}
                                />
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='how-to-trade-forex'
                                    image='mt5/how-to-trade-forex'
                                    header={it.L('How to trade Forex')}
                                    text={it.L('Learn how to read currency pairs, when to go long or short, and how to buy your first currency pair.')}
                                />
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='margin-policy'
                                    image='mt5/margin-policy'
                                    header={it.L('Margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our currency pairs.')}
                                />
                                <GetStartedSection
                                    link='get-started/forex'
                                    hash='contract-specification'
                                    image='mt5/contract-specification'
                                    header={it.L('Contract specifications')}
                                    text={it.L('Find out more about the costs and details of every currency pair we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <GetStartedSectionWrapper
                            section_id='cfds'
                            section_header={it.L('CFDs')}
                            section_description={it.L('Contracts for Difference (CFDs) are financial derivatives that allow you to speculate on the movement of an underlying asset without owning it.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='what-cfds-trading'
                                    image='mt5/what-cfds-trading'
                                    header={it.L('What is CFD trading')}
                                    text={it.L('Read our simple introduction to this popular derivative instrument to find out what you can trade with CFDs and their advantages.')}
                                />
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='how-trade-cfds'
                                    image='mt5/how-trade-cfds'
                                    header={it.L('How to trade CFDs')}
                                    text={it.L('Plan to start trading CFDs? Learn when to buy and sell, how to calculate your profits and losses, and how to close a position.')}
                                />
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='margin-policy'
                                    image='mt5/margin-policy'
                                    header={it.L('CFD margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our CFDs.')}
                                />
                                <GetStartedSection
                                    link='get-started/cfds'
                                    hash='contract-specification'
                                    image='mt5/contract-specification'
                                    header={it.L('Contract specifications')}
                                    text={it.L('Find out more about the costs and details of each CFD asset we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <GetStartedSectionWrapper
                            section_id='metals'
                            section_header={it.L('Metals')}
                            section_description={it.L('Diversify your portfolio with all four types of precious metals that are widely known as "safe haven" investments: gold, silver, platinum, and palladium.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='what-metals-trading'
                                    image='mt5/what-metals-trading'
                                    header={it.L('What is metals trading')}
                                    text={it.L('Learn the basics of metals trading and the categories of metals available.')}
                                />
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='how-trade-metals'
                                    image='mt5/how-trade-metals'
                                    header={it.L('How to trade metals')}
                                    text={it.L('Buy or sell all four available precious metals – depending on your market view. Also, learn what factors affect prices.')}
                                />
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='margin-policy'
                                    image='mt5/margin-policy' header={it.L('Margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our metal pairs.')}
                                />
                                <GetStartedSection
                                    link='get-started/metals'
                                    hash='contract-specification'
                                    image='mt5/contract-specification' header={it.L('Contract specifications')}
                                    text={it.L('Find out more about the costs and details of every metal pair we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                        <GetStartedSectionWrapper
                            section_id='cryptocurrencies'
                            section_header={it.L('Cryptocurrencies')}
                            section_description={it.L('Cryptocurrencies such as Bitcoin and Ethereum are decentralised digital assets that enable instant payments to anywhere in the world.')}
                        >
                            <div className='gr-row'>
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='what-crypto-trading'
                                    image='mt5/what-crypto-trading' header={it.L('What is cryptocurrency trading')}
                                    text={it.L('Speculate on the price movement of cryptocurrencies such as Bitcoin, Ethereum, and Litecoin without owning them.')}
                                />
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='how-trade-crypto'
                                    image='mt5/how-trade-crypto' header={it.L('How to trade cryptocurrencies')}
                                    text={it.L('Trade popular cryptocurrencies on our MT5 platform with leverage and variable spreads. No wallets are required to start trading.')}
                                />
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='margin-policy'
                                    image='mt5/margin-policy' header={it.L('Margin policy')}
                                    text={it.L('Not sure how margin works? Read our margin policy and learn how to calculate the margin for our cryptocurrency pairs.')}
                                />
                                <GetStartedSection
                                    link='get-started/cryptocurrencies'
                                    hash='contract-specification'
                                    image='mt5/contract-specification' header={it.L('Contract specifications')}
                                    text={it.L('Find out more about the costs and details of every cryptocurrency pair we offer.')}
                                />
                            </div>
                        </GetStartedSectionWrapper>
                    </TabContent>
                </TabContentContainer>
            </div>
        </TabContainer>
    </div>
);

export default Index;
