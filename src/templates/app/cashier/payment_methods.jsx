import React from 'react';
import { Table } from '../../_common/components/elements.jsx';

const Button = ({ url, real, className, text }) => (
    <a href={it.url_for(url)} className={`toggle button ${real ? 'client_real' : 'client_logged_out'} invisible`}>
        <span className={className || undefined}>{text}</span>
    </a>
);

const TableTitle = ({ title, className }) => (
    <h3 className={`gr-padding-10${className ? ` ${className}` : ''}`}>{title}</h3>
);

const PaymentLogo = ({ logo }) => (
    <img src={it.url_for(`images/pages/home/payment/${ logo }.svg`)} />
);

const TableValues = ({ value }) => {
    const values = Array.isArray(value) ? value : [value];
    return (
        <React.Fragment>
            { values.reduce((arr, e, inx) => arr === null ? [e] : [...arr, <br key={inx} />, e], null) }
        </React.Fragment>
    );
};

const ReferenceLink = ({ href, className = '', title = '' }) => (
    <a
        className={`payment-methods__reference ${className}`}
        href={href}
        target='_blank'
        aria-disabled={!href}
        title={title}
        rel='noopener noreferrer'
    />
);

const ReferenceLinks = ({ pdf_file, video_link }) => (
    <React.Fragment>
        {!pdf_file && !video_link && <span>&mdash;</span>}
        {pdf_file && <ReferenceLink
            className='payment-methods__reference-pdf'
            href={pdf_file && it.url_for(`download/payment/${pdf_file}`)}
            title={pdf_file}
        />}
        {video_link && <ReferenceLink
            className='payment-methods__reference-video'
            href={video_link}
            title={it.L('Video tutorial')}
        />}
    </React.Fragment>
);

const CustomTableHead = ({ data }) => (
    <React.Fragment>
        {data.map((item, index) => (
            <span key={index} className='th'>{item.text}</span>
        ))}
    </React.Fragment>
);

const CustomTableData = ({ data }) => (
    <React.Fragment>
        {data.map((item, index) => (
            <div key={index} className={item.td ? 'td-description' : 'td-list active'}>
                {item.td && <span className='td'>{item.td}</span>}
                {item.td_list &&
                    item.td_list.map((td, inx_td) => (
                        <p className='td' key={inx_td}>{td.text}</p>
                    ))
                }
            </div>
        ))}
    </React.Fragment>
);

const PaymentMethods = () => {
    const head = [
        { text: it.L('Method') },
        { attributes: { colSpan: 5, className: 'th-list' }, custom_th : <CustomTableHead data={[
            { text: it.L('Currencies') },
            { text: it.L('Min-Max Deposit') },
            { text: it.L('Min-Max Withdrawal') },
            { text: `${it.L('Processing Time')}*` },
            { text: it.L('Reference') },
        ]}
        />,
        },
    ];

    const deposit                  = 'Deposit: ';
    const withdrawal               = 'Withdrawal: ';
    const working_day              = '[_1] working day';
    const instant                  = 'Instant';
    const not_applicable           = 'Not applicable';
    const blockchain_confirmations = '[_1] blockchain confirmations';

    const createLink = (href) => (`<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`);

    return (
        <div id='cashier-content'>
            <h1>{it.L('Available payment methods')}</h1>

            <div className='center-text'>
                <div className='invisible upgrademessage'>
                    <a className='button' />
                </div>
                <p>
                    <Button url='new-account' text={it.L('Open an account now')} />
                    <Button url='cashier/forwardws?action=deposit'  real className='deposit'  text={it.L('Deposit')} />
                    <Button url='cashier/forwardws?action=withdraw' real className='withdraw' text={it.L('Withdraw')} />
                </p>
            </div>

            <div id='payment_methods' className='table-container'>
                <TableTitle title={it.L('Bank wire/Money transfer')} className='no-margin' />
                <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            {
                                id : 'bank-transfer',
                                row: [
                                    { text: <PaymentLogo logo='bank_transfer' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Deposit and withdraw your funds via international bank wire transfer.') },
                                        { td_list: [
                                            { text: 'USD GBP EUR AUD' },
                                            { text: '500 - 100,000' },
                                            { text: '500 - 100,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${working_day}`, 1), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_BankWire.pdf' video_link='https://youtu.be/fbnOZAf-04Y' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'internet-bank-transfer',
                                row: [
                                    { text: <PaymentLogo logo='internet_bank_transfer' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Enjoy the simplicity of online banking to fund your [_1] account.', it.website_name) },
                                        { td_list: [
                                            { text: 'USD GBP EUR' },
                                            { text: '25 - 10,000' },
                                            { text: '25 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${working_day}`, 1), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'paysec',
                                row: [
                                    { text: <PaymentLogo logo='paysec' />, className: 'eu-hide-parent' },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: 'PaySec was founded in 2014 to provide customers and merchants in the Asian region with a comprehensive range of payment methods through one payment gateway.' },
                                        { td_list: [
                                            { text: 'USD' },
                                            { text: '25 - 10,000' },
                                            { text: '25 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_PaySec.pdf' video_link='https://youtu.be/DTVspCgnx0M' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                        ],
                    }}
                />

                <TableTitle title={it.L('Credit/Debit Card')} />
                <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            {
                                id : 'visa',
                                row: [
                                    { text: <PaymentLogo logo='visa' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Visa is an international company that supports digital payments around the world, most commonly through their brand of credit and debit cards. For more info, please visit [_1].', `${createLink('http://visa.com')}`) },
                                        { td_list: [
                                            { text: 'USD GBP EUR AUD' },
                                            { text: '10 - 10,000' },
                                            { text: '10 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Credit_Debit.pdf' video_link='https://youtu.be/n_qQbML_qAI' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'mastercard',
                                row: [
                                    { text: <PaymentLogo logo='mastercard' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Mastercard is an international company that processes payments made with Mastercard-branded credit and debit cards. For more info, please visit [_1].', `${createLink('https://www.mastercard.us')}`) },
                                        { td_list: [
                                            { text: 'USD GBP EUR AUD' },
                                            { text: '10 - 10,000' },
                                            { text: '10 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Credit_Debit.pdf' video_link='https://youtu.be/n_qQbML_qAI' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                        ],
                    }}
                />

                <div className='gr-padding-10'>
                    <p className='hint'>{it.L('Note:')} {it.L('Mastercard withdrawals are only available to cards issued in an European country. If you do not meet this requirement, you may use an e-wallet method for withdrawal.')}</p>
                </div>

                <TableTitle title={it.L('E-wallet')} />
                <Table
                    data={{
                        thead: [ head ],
                        tbody: [
                            {
                                id : 'fasapay',
                                row: [
                                    { text: <PaymentLogo logo='fasapay' />, className: 'eu-hide-parent' },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('FasaPay enables electronic money transfers for individuals and payment gateways for merchants. For more info, please visit [_1].', `${createLink('https://www.fasapay.com')}`) },
                                        { td_list: [
                                            { text: 'USD' },
                                            { text: '5 - 10,000' },
                                            { text: '5 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Fasapay.pdf' video_link='https://youtu.be/PTHLbIRLP58' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'perfect-money',
                                row: [
                                    { text: <PaymentLogo logo='perfect_money' />, className: 'eu-hide-parent' },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Perfect Money allows individuals to make instant payments and money transfers securely on the Internet. For more info, please visit [_1].', `${createLink('https://perfectmoney.is')}`) },
                                        { td_list: [
                                            { text: 'USD EUR' },
                                            { text: '5 - 10,000' },
                                            { text: '5 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_PerfectMoney.pdf' video_link='https://youtu.be/fBt71VBp2Pw' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'skrill',
                                row: [
                                    { text: <PaymentLogo logo='skrill' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Skrill offers global payment solutions for individuals who wish to deposit funds, shop online, and transfer money to family and friends. For more info, please visit [_1].', `${createLink('https://www.skrill.com')}`) },
                                        { td_list: [
                                            { text: 'USD GBP EUR AUD' },
                                            { text: '5 - 10,000' },
                                            { text: '5 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Skrill.pdf' video_link='https://youtu.be/pQDVDC-mWuA' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'neteller',
                                row: [
                                    { text: <PaymentLogo logo='neteller' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('NETELLER provides businesses and individuals with a fast, simple, and secure way to transfer money online. For more info, please visit [_1].', `${createLink('https://www.neteller.com')}`) },
                                        { td_list: [
                                            { text: 'USD GBP EUR AUD' },
                                            { text: '5 - 10,000' },
                                            { text: '5 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Neteller.pdf' video_link='https://youtu.be/uHjRXzMQ8FY' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'webmoney',
                                row: [
                                    { text: <PaymentLogo logo='webmoney' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('WebMoney is an online payment settlement system that’s been operating since 1998. For more info, please visit [_1].', `${createLink('https://www.wmtransfer.com')}`) },
                                        { td_list: [
                                            { text: 'USD EUR' },
                                            { text: '5 - 10,000' },
                                            { text: '5 - 10,000' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_WebMoney.pdf' video_link='https://youtu.be/e0THC3c-fEE' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'qiwi',
                                row: [
                                    { text: <PaymentLogo logo='qiwi' />, className: 'eu-hide-parent' },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Qiwi is a payment service provider that was founded in 2007. It provides individuals with a simple way to transfer money, receive payments, and pay online. For more info, please visit [_1].', `${createLink('https://qiwi.com')}`) },
                                        { td_list: [
                                            { text: 'USD EUR' },
                                            { text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                            { text: <TableValues value={['5 - 200 (USD)', '5 - 150 (EUR)']} /> },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Qiwi.pdf' video_link='https://youtu.be/CMAF29cn9XQ' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'yandex',
                                row: [
                                    { text: <PaymentLogo logo='yandex' />, className: 'eu-hide-parent' },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Yandex.Money is an electronic payment service provider that offers consumers an easy, safe, and reliable online payment method. For more info, please visit [_1].', `${createLink('https://money.yandex.ru')}`) },
                                        { td_list: [
                                            { text: 'USD' },
                                            { text: '25 - 10,000' },
                                            { text: 'N/A' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${not_applicable}`)]} /> },
                                            { text: <ReferenceLinks /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'paysafe',
                                row: [
                                    { text: <PaymentLogo logo='paysafe' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('paysafecard offers a voucher-based online payment method that does not require a bank account, credit card, or other personal information. For more info, please visit [_1].', `${createLink('https://www.paysafecard.com')}`) },
                                        { td_list: [
                                            { text: 'USD GBP EUR AUD' },
                                            { text: '5 - 1,000' },
                                            { text: '5 - 750' },
                                            { text: <TableValues value={[it.L(`${deposit}${instant}`), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_PaySafeCard.pdf' video_link='https://youtu.be/5QzGc1nleQo' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                        ],
                    }}
                />
                <TableTitle
                    data-show='-malta, -maltainvest'
                    className='eu-hide'
                    title={it.L('Cryptocurrencies')}
                    withdrawal={it.L('Min Withdrawal')}
                />
                <Table
                    data-show='-malta, -maltainvest'
                    className='eu-hide'
                    data={{
                        thead: [
                            [
                                { text: it.L('Method') },
                                { attributes: { colSpan: 5, className: 'th-list' }, custom_th : <CustomTableHead data={[
                                    { text: it.L('Currencies') },
                                    { text: it.L('Min Deposit') },
                                    { text: it.L('Min Withdrawal') },
                                    { text: `${it.L('Processing Time')}*` },
                                    { text: it.L('Reference') },
                                ]}
                                />,
                                },
                            ],
                        ],
                        tbody: [
                            {
                                id : 'bitcoin',
                                row: [
                                    { text: <PaymentLogo logo='bitcoin' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Bitcoin is the world’s first decentralised cryptocurrency, created in 2009. For more info, please visit [_1].', `${createLink('https://bitcoin.org')}`) },
                                        { td_list: [
                                            { text: 'BTC' },
                                            { text: '0.002' },
                                            { text: '0.0003' },
                                            { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Bitcoin.pdf' video_link='https://youtu.be/StIW7CviBTw' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'bitcoin-cash',
                                row: [
                                    { text: <PaymentLogo logo='bitcoin_cash' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Bitcoin Cash is a cryptocurrency that emerged from a fork of the original Bitcoin. For more info, please visit [_1].', `${createLink('https://www.bitcoincash.org')}`) },
                                        { td_list: [
                                            { text: 'BCH' },
                                            { text: '0.01' },
                                            { text: '0.003' },
                                            { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_BitcoinCash.pdf' video_link='https://youtu.be/jmTx7QMi-Tg' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            {
                                id : 'ethereum-black',
                                row: [
                                    { text: <PaymentLogo logo='ethereum_black' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Ether is a cryptocurrency that is used to pay for transactions on the Ethereum platform. For more info, please visit [_1].', `${createLink('https://www.ethereum.org')}`) },
                                        { td_list: [
                                            { text: 'ETH' },
                                            { text: '0.01' },
                                            { text: '0.01' },
                                            { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Ethereum.pdf' video_link='https://youtu.be/B7EVLt3lIMs' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                            // {
                            //     id : '',
                            //     row: [
                            //         { text: <PaymentLogo logo='' /> },
                            //         { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                            //             { td: 'description' },
                            //             { td_list: [
                            //                 { text: 'ETC' },
                            //                 { text: '0.002' },
                            //                 { text: '0.002' },
                            //                 { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                            //             ],
                            //             },
                            //         ]}
                            //         />,
                            //         },
                            //     ],
                            // },
                            {
                                id : 'litecoin',
                                row: [
                                    { text: <PaymentLogo logo='litecoin' /> },
                                    { attributes: { colSpan: 5, className: 'toggler' }, custom_td : <CustomTableData data={[
                                        { td: it.L('Litecoin is a cryptocurrency similar to Bitcoin, but capable of a higher transaction volume and faster confirmation times. For more info, please visit [_1].', '<a href="https://litecoin.org" target="_blank">https://litecoin.org</a>') },
                                        { td_list: [
                                            { text: 'LTC' },
                                            { text: '0.1' },
                                            { text: '0.02' },
                                            { text: <TableValues value={[it.L(`${deposit}${blockchain_confirmations}`, 3), it.L(`${withdrawal}${working_day}`, 1)]} /> },
                                            { text: <ReferenceLinks pdf_file='Binary.com_Litecoin.pdf' video_link='https://youtu.be/DJhP5UjKPpI' /> },
                                        ],
                                        },
                                    ]}
                                    />,
                                    },
                                ],
                            },
                        ],
                    }}
                />
            </div>

            <div className='gr-padding-10'>
                <p className='hint'>* {it.L('All your deposits and withdrawals are processed by [_1] within 24 hours. However, there may be additional processing time required by your bank or money transfer service.', it.website_name)}</p>
            </div>
        </div>
    );
};

export default PaymentMethods;
