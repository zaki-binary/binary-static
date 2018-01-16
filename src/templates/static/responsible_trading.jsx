import React from 'react';

const ResponsibleTrading = () => (
    <div className='static_full' id='responsible-trading'>
        <div className='container'>
            <h1>{it.L('Responsible Trading')}</h1>
            <p>{it.L('Please remember at all times that trading binary options can be an exciting activity, but we have a moral duty to remind you of the risks you may run. Options trading can become a real addiction, as can any other activity pushed to its limits. We kindly ask you to engage in a careful self-analysis to check if you are at risk. To avoid the danger of such an addiction, it is important that you follow some basic principles and guidelines.')}</p>
            <ol>
                <li>{it.L('Use the opportunity provided by our website to practice for free with our virtual money account facility. This will enable you to get used to the functionalities and rules of the website.')}</li>
                <li>{it.L('Do not trade more than you can afford.')}</li>
                <li>{it.L('Do not trade when you are tired or are under the influence of alcohol.')}</li>
                <li>{it.L('Put a limit on your winnings. Once you have reached it put some aside and trade with the rest of the money.')}</li>
                <li>{it.L('Trade only with money you can afford to lose. Do not trade with borrowed money.')}</li>
            </ol>

            <h2>{it.L('Written limits and self-exclusion')}</h2>
            <p>{it.L('[_1] provides you with the opportunity to either self-exclude or <a href=\'[_2]\'>set limits on your trading activities</a> on this website. You may also <a href=\'[_3]\'>contact us</a> to state the limits you wish to set via email or phone. Available limits are:', it.website_name, it.url_for('user/security/self_exclusionws'), it.url_for('contact'))}</p>
            <ol>
                <li>{it.L('a limit on the amount you may trade within a specified period of time;')}</li>
                <li>{it.L('a limit on the losses you may incur within a specified period of time;')}</li>
                <li>{it.L('a limit on the amount of time you may trade in any given online session;')}</li>
                <li>{it.L('a definite or indefinite period during which you wish to exclude yourself from the website.')}</li>
            </ol>

            <p>{it.L('Limits 1 to 3 may only be changed or increased after 7 days\' notice.')}</p>
            <p>{it.L('Clients who wish to self-exclude should be aware that the self-exclusion period is a minimum of six months and are given the option to extend it to a total of at least five years, immediately without any cooling-off period. When the self-exclusion period is set, the balance of funds in the client\'s account will be refunded to the client. At the end of the self-exclusion period, the self-exclusion remains in place, unless positive action is taken by the client in order to trade again.')}</p>
            <p>{it.L('Clients who do not wish to renew the self-exclusion and make a request to begin trading again, shall be given one day to cool off before being allowed access to the website. It is important to note that contact must be made to our customer services via telephone. Email contact is not sufficient.')}</p>

            <h2>{it.L('Underage Gambling')}</h2>
            <p>{it.L('Clients must be aware that underage gambling is an offence. If a client, upon age verification, is proven to be underage, they will be deprived from any winnings and only deposits made shall be refunded. For clients registered with Binary (Europe) Ltd, all the funds from their MLT account will be transferred to the Malta Gaming Authority. In order to reclaim these funds, clients will need to contact the MGA directly.')}</p>

            <h2>{it.L('Filtering Controls')}</h2>
            <p>{it.L('Our site can be filtered using a number of filtering systems available on the market which could be used to restrict one\'s access to our site.')}</p>
            <p>{it.L('[_1] supports [_2] which is the leading charity in Britain committed to minimising gambling-related harm. The charity funds education, prevention and treatment services and commissions research to help people understand more about gambling-related harm. It also offers a national gambling helpline to offer confidential advice and emotional support to those that seek help about their gambling.', it.website_name, '<a target=\'_blank\' href=\'https://about.gambleaware.org/\' rel=\'noopener noreferrer\'>GambleAware</a>')}</p>
            <p>{it.L('[_1] also provides links to an online quiz to assess a potential gambling problem and an online gambling calculator to see how much you can really spend.', '<a target=\'_blank\' href=\'https://www.gambleaware.co.uk/\' rel=\'noopener noreferrer\'>GambleAware</a>')}</p>
        </div>
    </div>
);

export default ResponsibleTrading;
