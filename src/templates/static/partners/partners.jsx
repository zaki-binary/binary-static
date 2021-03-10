import React from 'react';

const Column = ({
    url,
    target,
    image,
    header,
    text,
}) => (
    <div className='gr-4 gr-12-m gr-no-gutter center-text-m'>
        <div className='gr-6 gr-padding-10 gr-centered-m'>
            { url &&
                <a href={`${url}`} rel={/^http/.test(url) ? 'noopener noreferrer' : undefined} target={target || undefined}>
                    <img className='responsive' src={it.url_for(`images/pages/partners/${image}.svg`)} />
                </a>
            }
        </div>
        <div className='gr-12'>
            <h4>
                <a href={`${url}`} rel={/^http/.test(url) ? 'noopener noreferrer' : undefined} target={target || undefined}>{header}</a>
            </h4>
            <p>{text}</p>
        </div>
    </div>
);

const Partners = () => (
    <React.Fragment>
        <div className='container'>
            <div className='static_full'>
                <h1>{it.L('Partners')}</h1>
                <p>{it.L('[_1] provides business partnership services via the following programs.', it.website_name)}</p>
            </div>

            <div className='gr-row gr-clear'>
                <Column
                    url={it.url_for('payment-agent')}
                    image='payment-agents'
                    header={it.L('Payment Agent')}
                    text={it.L('Apply to become a Payment Agent')}
                />
                <Column
                    url='https://developers.binary.com'
                    target='_blank'
                    image='api'
                    header={it.L('API')}
                    text={it.L('Develop your own trading application with our APIs.')}
                />

                <Column
                    url={it.url_for('open-source-projects')}
                    image='open-source-venture'
                    header={it.L('Open Source')}
                    text={it.L('Contribute to [_1]\'s open-source projects.', it.website_name) }
                />
            </div>

            <div className='gr-row gr-clear'>
                <Column
                    url='https://academy.binary.com/en/contributors/'
                    image='contributors'
                    target='_blank'
                    header={it.L('Contributors')}
                    text={it.L('Apply to become a contributor')}
                />
                <Column
                    url={it.url_for('security-testing')}
                    image='tester'
                    header={it.L('Security Testing')}
                    text={it.L('Earn money for any verifiable errors that you find.')}
                />

                <Column
                    url={it.url_for('liquidity-solutions')}
                    image='liquidity-solutions'
                    header={it.L('Liquidity solutions')}
                    text={it.L('Access multi-asset liquidity from top-tier institutions.') }
                />
            </div>
        </div>
    </React.Fragment>
);

export default Partners;
