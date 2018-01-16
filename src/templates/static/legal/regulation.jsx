import React from 'react';
import {FillBox} from '../../_common/components/elements.jsx';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const TimelineFirst = () => (
    <div className='gr-1 gr-2-m gr-centered'>
        <img className='responsive' src={it.url_for('images/pages/regulation/timeline.svg')} />
    </div>
);

const TimelineMid = () => (
    <React.Fragment>
        <div className='gray-line'></div>
        <TimelineFirst />
    </React.Fragment>
);

const Box = ({
    first,
    last,
    header,
    children,
}) => (
    <React.Fragment>
        {first ? <TimelineFirst /> : undefined}
        <div className='background-gray fill-bg-color center-text gr-padding-30 gr-12'>
            <div className='gr-12 gr-padding-30'>
                <h1>{header}</h1>
                {children}
            </div>
        </div>
        {last ? undefined : <TimelineMid />}
    </React.Fragment>
);

const RegulatorImage = ({
    padding,
    padding_m,
    href,
    image,
}) => (
    <div className={`gr-${padding || 2} gr-${padding_m || 4}-m gr-centered gr-padding-10`}>
        <a href={href} target='_blank' rel='noopener noreferrer'>
            <img className='responsive' src={it.url_for(image)} />
        </a>
    </div>
);

const RegulatorText = () => (
    <p>
        <strong>{it.L('Regulator:')}</strong>
    </p>
);

const Area = ({items}) => {
    const square_wh = 10.6;
    const default_width = 37.8;
    const svg_width = 320;
    const svg_scale = 900 / svg_width;
    const normalize = n => n.toFixed(2);

    return (
        <React.Fragment>
            {items.map((item, idx) =>(
                <area
                    shape='rect'
                    coords={`${normalize(item.x * svg_scale)},${normalize(item.y * svg_scale)},${normalize((item.x + (item.width || default_width) + square_wh) * svg_scale)},${normalize((item.y + square_wh) * svg_scale)}`}
                    href={item.link || it.url_for(`download/regulation/${item.name.replace(' ', '')}.pdf`)}
                    alt={item.name}
                    key={idx}
                    target='_blank'
                    rel='noopener noreferrer'
                />
            ))}
        </React.Fragment>
    );
};

const Regulation = () => (

<div className='static_full'>
    <h1 className='center-text'>{it.L('Regulatory Information')}</h1>
    <div className='gr-parent gr-padding-30'>
        <p className='center-text'>{it.L('[_1] is a licensed and regulated trading platform that serves over 1,000,000 customers globally. We hold multiple licenses to comply with regulations around the world. Since 1999, we’ve served our clients with a constant and unwavering commitment to integrity and reliability. We always hold ourselves to the highest ethical standards, in addition to our regulatory requirements.', it.website_name)}</p>

        <SeparatorLine className='gr-parent gr-padding-20' invisible />
    </div>

    <Box header={it.L('Binary Group Ltd.')} first >
        <p>{it.L('Binary Group Ltd., with registered office address situated at Kingston Chambers, Road Town, Tortola, British Virgin Islands, is the holding company for the Binary group.')}</p>
    </Box>

    <Box header={it.L('Binary K.K.')} >
        <p>{it.L('Binary K.K., 3F Hiroo Miyata Building, 1-9-16 Hiroo, Shibuya-ku, Tokyo 150-0012. Licensed and regulated as a Type 1 Financial Instruments Business by the KLFB (license no. 2949) and a member of FFAJ (membership no. 1590).')}</p>
        <p>{it.L('Japan residents will have their account opened with Binary K.K. and will use our Japan trading platform, which is compliant with Japan rules and regulations.')}</p>
        <p><strong>{it.L('Regulators:')}</strong></p>
        <RegulatorImage padding='3' padding_m='6' href='http://www.fsa.go.jp' image='images/pages/regulation/fsa-logo.png' />
        <RegulatorImage padding='4' padding_m='8' href='http://www.ffaj.or.jp/en/memberlist/list.html#k_sakimono_senmon'
            image='images/pages/regulation/binarykk-logo.gif'/>
        <div className='ja-hide center-text gr-padding-20 gr-child'>
            <button id='visit_japan'>{it.L('View Japanese website')}</button>
        </div>
    </Box>

    <Box header={it.L('Binary Investments (Europe) Ltd')} >
        <p>{it.L('Binary Investments (Europe) Ltd, Mompalao Building, Suite 2, Tower Road, Msida MSD1825, Malta. Licensed and regulated as a Category 3 Investment Services provider by the Malta Financial Services Authority (<a href=\'[_1]\' target=\'_blank\' download=1>licence no. IS/70156</a>).', it.url_for('/download/WS-Binary-Investments-Europe-Limited.pdf'))}</p>
        <p>{it.L('European Union residents who wish to trade investment products will have their accounts opened with Binary Investments (Europe) Ltd.')}</p>
        <div className='gr-padding-30 gr-12' id='accordion'>
            <h3 aria-expanded='true' aria-selected='true'>{it.L('EU Passport Rights')}</h3>
            <div>
                <p>{it.L('Binary Investments (Europe) Limited is entitled to provide services in another EU Member State through EU passporting rights. Refer to the map below for the list of EU countries that have access to [_1] via EU passporting rights - freedom to provide cross border services.', it.website_name)}</p>
                <div className='center-text gr-padding-10 gr-12'>
                    <img className='responsive' src={it.url_for('images/pages/regulation/map.svg')} useMap='#planetmap' />
                </div>
                <map name='planetmap' id='planetmap'>
                    <Area items={[
                        { name: 'Sweden',         x: 127.7, y: 7.6 },
                        { name: 'Denmark',        x: 120.4, y: 19.7 },
                        { name: 'Germany',        x: 112,   y: 31.8 },
                        { name: 'Netherlands',    x: 92.8,  y: 43.9,  width: 46.2},
                        { name: 'United Kingdom', x: 2.7,   y: 86.6,  width: 55.7},
                        { name: 'Luxembourg',     x: 11.6,  y: 114.5, width: 46.9},
                        { name: 'France',         x: 20.6,  y: 126.3 },
                        { name: 'Spain',          x: 3.6,   y: 144.3 },
                        { name: 'Portugal',       x: 3.6,   y: 156.3 },
                        { name: 'Italy',          x: 14.2,  y: 168.5, width: 27.3},
                        { name: 'Austria',        x: 100.4, y: 185.3 },
                        { name: 'Slovenia',       x: 109.4, y: 201.5, width: 37.8},
                        { name: 'Croatia',        x: 142.6, y: 215.2,                       link: 'http://www.hanfa.hr/capital-market/registers/notifications-from-eu-member-states' },
                        { name: 'Greece',         x: 199.4, y: 215.3 },
                        { name: 'Cyprus',         x: 257.8, y: 221.8, width: (48.4 - 10.6), link: 'http://www.cysec.gov.cy/en-GB/entities/investment-firms/member-states/Cross-Border/43503/' },
                        { name: 'Bulgaria',       x: 254.3, y: 159.5, width: (48.4 - 10.6) },
                        { name: 'Romania',        x: 254.3, y: 147.7 },
                        { name: 'Hungary',        x: 254.2, y: 135.9,                       link: 'https://alk.mnb.hu/en/left_menu/market_participants/kereso/kereses?ktasearch_value=&ktasearch_label=&ktasearch_prev_value=&pmod=simpleSearch&n=Binary+Investments+%28Europe%29+Ltd&st=0&i=&a=1&x=56&y=8' },
                        { name: 'Slovakia',       x: 254.3, y: 124.2 },
                        { name: 'Czech Republic', x: 238.9, y: 112.4, width: 53.2 },
                        { name: 'Poland',         x: 258,   y: 95.3,  width: 34.2},
                        { name: 'Lithuania',      x: 252.9, y: 83.5,  width: 39.3,          link: 'https://www.lb.lt/en/sfi-financial-market-participants?query=binary&ff=1' },
                        { name: 'Latvia',         x: 258,   y: 71.7,  width: 34.2,          link: 'http://www.fktk.lv/en/market/financial-instruments-market/service-providers-from-the-eea/freedom-to-provide-services.html' },
                        { name: 'Estonia',        x: 258,   y: 60.0,  width: 34.2},
                        { name: 'Finland',        x: 258,   y: 13.9,  width: 34.2},
                    ]} />
                </map>
            </div>

            <h3>{it.L('Pillar 3 Disclosures')}</h3>
            <div>
                <p>{it.L('The Pillar 3 disclosure report of Binary Investments (Europe) Limited has been prepared in accordance with the Capital Requirements Directive IV and the Capital Requirements Regulation. Read our Pillar 3 disclosure report to understand how we comply with market discipline as a market participant.')}</p>
                <FillBox padding='5' center border='border-dark-gray' image='images/pages/regulation/pillar.svg'
                    href={it.url_for('/download/BIEL_Pillar_3_Report_20170426.pdf')} target='_blank' download text={it.L('Pillar 3 disclosure report')} />
            </div>

            <h3 id='key_information_documents'>{it.L('Key Information Documents')}</h3>
            <div>
                <p>{it.L('These documents provide you with key information about our investment products. This information is required by law to help you understand the nature, risks, costs, potential gains and losses of these products and to help you compare them with other products.')}</p>
                <div className='gr-row'>
                    <FillBox padding='4' center border='border-dark-gray' href={it.url_for('/download/key_information_document/Up_Down.pdf')}        target='_blank' download text={it.L('Up/Down')} />
                    <FillBox padding='4' center border='border-dark-gray' href={it.url_for('/download/key_information_document/Touch_No_Touch.pdf')} target='_blank' download text={it.L('Touch/No Touch')} />
                    <FillBox padding='4' center border='border-dark-gray' href={it.url_for('/download/key_information_document/In_and_Out.pdf')}     target='_blank' download text={it.L('In/Out')} />
                </div>
            </div>
        </div>
    </Box>

    <Box header={it.L('Binary (Europe) Ltd')} >
        <p>{it.L('Binary (Europe) Ltd, Mompalao Building, Suite 2, Tower Road, Msida MSD1825, Malta. Licensed and regulated (for gambling products only - [_1]\'s Volatility Indices) by the Malta Gaming Authority in Malta (licence no MGA/CL2/118/2000) and for UK clients by the UK Gambling Commission - <a href="https://secure.gamblingcommission.gov.uk/gccustomweb/PublicRegister/PRSearch.aspx?ExternalAccountId=39495" target="_blank">view licence</a>.', it.website_name)}</p>
        <p>{it.L('European Union residents who wish to trade gambling products will have their accounts opened with Binary (Europe) Ltd.')}</p>
        <RegulatorText />
        <RegulatorImage padding='4' padding_m='8' href='http://www.mga.org.mt/' image='images/pages/why-us/mga-logo2.svg' />
    </Box>

    <Box header={it.L('Binary (IOM) Ltd')} >
        <p>{it.L('Binary (IOM) Ltd, First Floor, Millennium House, Victoria Road, Douglas, Isle of Man, IM2 4RW. Licensed and regulated by the Gambling Supervision Commission in the Isle of Man (current online gambling licence granted on the 31 August 2017) and for UK clients by the UK Gambling Commission - <a href="https://secure.gamblingcommission.gov.uk/gccustomweb/PublicRegister/PRSearch.aspx?ExternalAccountId=39172" target="_blank">view licence</a>.')}</p>
        <p>{it.L('UK and Manx residents who wish to trade gambling products will have their accounts opened with Binary (IOM) Ltd.')}</p>
        <RegulatorText />
        <RegulatorImage href='https://www.gov.im/gambling/' image='images/pages/footer/isle-of-man.png' />
    </Box>

    <Box header={it.L('Binary (C.R.) S.A.')} >
        <p>{it.L('Binary (C.R.) S.A., registered in Costa Rica. Clients from the rest of the world (excluding certain countries such as the USA, Costa Rica, Hong Kong) will have their account opened with Binary (C.R.) S.A.')}</p>
        <p>{it.L('[_1] is not available in Costa Rica and is not regulated or supervised by any regulatory body in the Costa Rican financial system.', it.website_name)}</p>
    </Box>

    <Box header={it.L('Binary (V) Ltd')} last >
        <p>{it.L('Binary (V) Ltd, Govant Building, Port Vila, PO Box 1276, Vanuatu, Republic of Vanuatu. Licensed and regulated by the Vanuatu Financial Services Commission - <a href="https://www.vfsc.vu/wp-content/uploads/2015/12/List-of-Licensees-under-Dealers-in-Securities-Licensing-Act-CAP-70-18.11.2016.pdf" target="_blank">view licence</a>.')}</p>
        <p>{it.L('Clients from the rest of the world (excluding certain countries such as the USA, Costa Rica, Hong Kong) will have their FX and CFD Metatrader 5 account opened with Binary (V) Ltd. [_1] is not available in the Republic of Vanuatu.', it.website_name)}</p>
        <RegulatorText />
        <RegulatorImage href='https://www.vfsc.vu/' image='images/pages/regulation/vanuatu-logo.svg' />
    </Box>
</div>

);

export default Regulation;
