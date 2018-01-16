import React from 'react';
import { List, Table } from '../../_common/components/elements.jsx';
import { BuySellCurrency, Section, HeaderSecondary, Box, NavButtons } from './common.jsx';

const hundredth = '0.01';
const tenth     = '0.1';
const one       = '1';
const ten       = '10';
const thousand  = '1,000';

const ten_percent         = '10%';
const thirty_tree_percent = '33%';

const Cryptocurrencies = () => (
    <div className='static_full get-started-beta'>
        <h1>{it.L('MetaTrader 5')}</h1>
        <div className='gr-row'>
            <div className='gr-3 gr-hide-m sidebar-container'>
                <div className='sidebar'>
                    <List id='sidebar-nav' items={[
                        { id: 'what-crypto-trading',      href: '#what-crypto-trading',      text: it.L('What is cryptocurrency trading') },
                        { id: 'how-trade-crypto',         href: '#how-trade-crypto',         text: it.L('How to trade cryptocurrencies') },
                        { id: 'margin-policy',            href: '#margin-policy',            text: it.L('Margin policy') },
                        { id: 'contract-specification',   href: '#contract-specification',   text: it.L('Contract specifications') },
                    ]} />
                </div>
            </div>
            <div className='gr-9 gr-12-m'>
                <Section id='what-crypto-trading' header={it.L('What is cryptocurrency trading')}>
                    <p>{it.L('Cryptocurrencies such as Bitcoin and Ethereum are decentralised digital currencies on the blockchain.')}</p>
                    <p>{it.L('Some of the things that cryptocurrencies have in common include:')}</p>
                    <ul className='bullet'>
                        <li>{it.L('Decentralisation – The decentralised nature of cryptocurrencies means that no single government body or financial authority has control over them')}</li>
                        <li>{it.L('Blockchain technology – All cryptocurrencies use a variation of blockchain technology (a kind of public ledger) to score records of each transaction. ')}</li>
                        <li>{it.L('High level of security – Each cryptocurrency transaction is secured through advanced cryptographic techniques that make it almost impossible to counterfeit')}</li>
                    </ul>
                    <p>{it.L('Trading cryptocurrencies on our MetaTrader 5 platform means taking a position on a cryptocurrency pair when you expect it to rise or fall in value so you can make a profit when your prediction is correct.')}</p>
                </Section>
                <Section id='how-trade-crypto' header={it.L('How to trade cryptocurrencies')}>
                    <p>{it.L('Trade Bitcoin, Ethereum, and Litecoin pairs without owning them. Our cryptocurrency pairs quote a cryptocurrency such as Bitcoin against a fiat currency, such as the US dollar.')}</p>
                    <p>{it.L('Similar to Forex trading, you must understand when to buy (or "go long") and when to sell (or "go short"). In Forex trading, you\'ll buy a certain currency pair if you think the value of the base currency will rise. The opposite is also true: you will sell a certain currency pair if you think the value of the base currency will fall.')}</p>
                    <p>{it.L('The same concept applies to our cryptocurrency pairs.')}</p>
                    <p>{it.L('Let\'s compare the differences between buying and selling, using the BTC/USD as an example:')}</p>
                    <BuySellCurrency currency_one={it.L('BTC')} currency_two={it.L('USD')} />
                    <p>{it.L('In a nutshell, when you go long on the BTC/USD with Binary.com, you are not purchasing bitcoin directly. Instead, you\'re taking a position that the BTC/USD will rise in value whereby you will make a profit. If you go long on the BTC/USD and its value falls, then you will make a loss.')}</p>
                </Section>
                <Section id='margin-policy' header={it.L('Margin policy')}>
                    <p>{it.L('Margin allows you to trade on leverage – meaning your existing capital can give you a much higher level of market exposure.')}</p>
                    <p>{it.L('For example, if you wanted to purchase 100 units of a particular asset that\'s trading at USD 50 per unit through a traditional broker, it would typically cost you USD 5,000 for this transaction.')}</p>
                    <p>{it.L('However, with leverage you can purchase those 100 units at a fraction of the typical cost – depending on the leverage afforded to you by your broker or trading platform.')}</p>

                    <HeaderSecondary header={it.L('How to calculate margin')} />
                    <p>{it.L('You can determine the margin for our cryptocurrency pairs by using the formula below:')}</p>
                    <Box text={`${it.L('Price')} x ${it.L('volume (units)')} x ${it.L('margin rate (%)')} = ${it.L('Margin')}`} />
                    <p>{it.L('For example, if you wanted to buy one volume of the BTC/EUR cryptocurrency pair at a price of USD 4831.400 and at a margin rate of 10%, the margin that you need to purchase one lof of BTC/EUR will be calculated as follows:')}</p>
                    <Box text={`4831.400 x 1 x 10% = ${it.L('USD')} 483.14`} />
    
                    <HeaderSecondary header={it.L('What\'s a margin call and how is it applied')} />
                    <p>{it.L('Equity is the sum of your balance and floating profit and loss (PnL). Margin level is the ratio of equity to margin. When that ratio reaches a specified percentage (usually 100%), your account will be placed under margin call. This does not affect your ability to open new positions; it serves to alert you that your floating PnL is moving lower. However, it is recommended to add funds to your account in order to keep your positions open. Alternatively, you may close losing positions.')}</p>
    
                    <HeaderSecondary header={it.L('What\'s a stop out level and how is it applied')} />
                    <p>{it.L('If your margin level reaches an even lower level (usually 50%), it will reach the stop out level where it is unable to sustain an open position. This will lead to some, or all your open positions being forcibly closed (also known as "forced liquidation").')}</p>
                    <p>{it.L('When your account hits the forced liquidation level, your orders and positions are forcibly closed in the following sequence:')}</p>
                    <ol>
                        <li>{it.L('We delete an order with the largest margin reserved')}</li>
                        <li>{it.L('If your margin level is still under the stop out level, your next order will be deleted. However, orders without margin requirements will not be deleted')}</li>
                        <li>{it.L('If your margin level is still under the stop out level, we will close an open position with the largest loss')}</li>
                        <li>{it.L('We will continue to close open positions until your margin level becomes higher than the stop out level')}</li>
                    </ol>
                </Section>
                <Section id='contract-specification' header={it.L('Contract specifications')}>
                    <Table scroll data={{
                        thead: [[
                            { text: it.L('Symbol'),         className: 'gr-padding-10' },
                            { text: it.L('Description'),    className: 'gr-padding-10' },
                            { text: it.L('Minimum volume'), className: 'gr-padding-10' },
                            { text: it.L('Volume step'),    className: 'gr-padding-10' },
                            { text: it.L('Maximum volume'), className: 'gr-padding-10' },
                            { text: it.L('Margin rate'),    className: 'gr-padding-10' },
                            { text: it.L('Spread'),         className: 'gr-padding-10' },
                        ]],
                        tbody: [
                            [{ text: 'BTC/EUR' }, { text: it.L('Bitcoin vs Euro')       }, { text: hundredth }, { text: hundredth }, { text: ten      }, { text: ten_percent         }, { text: it.L('Variable') }],
                            [{ text: 'BTC/USD' }, { text: it.L('Bitcoin vs US dollar')  }, { text: hundredth }, { text: hundredth }, { text: ten      }, { text: ten_percent         }, { text: it.L('Variable') }],
                            [{ text: 'ETH/EUR' }, { text: it.L('Ethereum vs Euro')      }, { text: tenth     }, { text: hundredth }, { text: thousand }, { text: thirty_tree_percent }, { text: it.L('Variable') }],
                            [{ text: 'ETH/USD' }, { text: it.L('Ethereum vs US dollar') }, { text: tenth     }, { text: hundredth }, { text: thousand }, { text: thirty_tree_percent }, { text: it.L('Variable') }],
                            [{ text: 'LTC/EUR' }, { text: it.L('Litecoin vs Euro')      }, { text: one       }, { text: hundredth }, { text: thousand }, { text: thirty_tree_percent }, { text: it.L('Variable') }],
                            [{ text: 'LTC/USD' }, { text: it.L('Litecoin vs US dollar') }, { text: one       }, { text: hundredth }, { text: thousand }, { text: thirty_tree_percent }, { text: it.L('Variable') }],
                        ],
                    }} />

                    <HeaderSecondary header={it.L('How to read the contract specifications table')} />
                    <p>{it.L('Each time you open a position on a cryptocurrency pair, you can start with a minimum volume as indicated in the table above.')}</p>
                    <p>{it.L('Margin rate indicates how much capital you can control based on your initial deposit. For example, a 10%  margin rate  will allow you to control up to USD 100,000 using only USD 10,000 of your own money as deposit. This rate requires 10% of the asset\'s value as margin.')}</p>
                    <p>{it.L('To learn more, read our Margin Policy that further explains our margin requirements. Please note that we do not charge swap rates for our cryptocurrency pairs.')}</p>
                </Section>
                <NavButtons parent='mt5' section='cryptocurrencies' />
            </div>
        </div>
    </div>
);

export default Cryptocurrencies;
