import React from 'react';
import Loading from '../_common/components/loading.jsx';
import Title from '../_common/components/title.jsx';
import Favicons from '../_common/includes/favicons.jsx';
import AntiClickjack from '../_common/includes/anti_clickjack.jsx';
import GTM from '../_common/includes/gtm.jsx';

const Head = () => (
    <head>
        <AntiClickjack />
        <meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
        <meta httpEquiv='Content-Language' content={it.language} />
        <meta
            name='description'
            content={` ${it.L('[_1] ICO, Invest in the world\'s premier platform for binary options trading', it.broker_name)}`}
        />
        <meta
            name='keywords'
            content={` ${it.L('binary options, forex, forex trading, online trading, financial trading, binary trading, index trading, trading indices, forex trades, trading commodities, binary options strategy, binary broker, binary bet, binary options trading platform, binary strategy, finance, stocks, investment, trading')}`}
        />
        <meta name='author' content={it.broker_name} />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
        <meta name='dcterms.rightsHolder' content={it.broker_name} />
        <meta name='dcterms.rights' content={it.broker_name} />
        <meta property='og:title' content={it.broker_name} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={it.url_for('images/common/og_image.gif')} />

        <Title />
        <Favicons />

        <link href={it.url_for(`css/ico.css?${it.static_hash}`)} rel='stylesheet' />
        <link href={`https://style.binary.com/binary.css?${it.static_hash}`} rel='stylesheet' />
    </head>
);

const IcoDisclaimer = () => (
    <html>
        <Head />
        <body>
            <GTM />
            <div className='navbar-fixed-top primary-bg-color' role='navigation'>
                <div className=''>
                    <div className='navbar-header'>
                        <a className='navbar-brand page-scroll logo' href={it.url_for('ico')} />
                    </div>
                </div>
            </div>

            <div className='container disclaimer'>
                <div id='loading'><Loading /></div>

                <div className='gr-row invisible' id='disclaimer_form'>
                    <div className='gr-10 gr-push-1'>
                        <h1>{it.L('Disclaimer')}</h1>
                        <p>{it.L('Access to these materials is restricted in certain jurisdictions. Please indicate your country of residence. By clicking the “Submit” button below you certify that you are an individual resident in the country you stipulated.')}</p>

                        <form id='frm_select_residence'>
                            <select id='residence_list'>
                                <option value='0' selected disabled>{it.L('Please select')}</option>
                            </select>
                            <span className='error-msg invisible'>{it.L('Please select a country')}</span>
                            <div>
                                <button id='btn-select-residence'>{it.L('Submit')}</button>
                            </div>
                        </form>
                    </div>
                    <div className='gr-10 gr-push-1 invisible' id='notice_msg'>
                        <h2>{it.L('Notice to prospective investors in')} <span id='country_name' /></h2>
                        <div className='msg disclaimer-container'>
                            <div id='gb' className='invisible'>
                                <p>{it.L('The promotion of the Company and the distribution of this Information Memorandum in the United Kingdom is restricted by Financial Services and Markets Act 2000 of the United Kingdom (the "Act").')}</p>
                                <p>{it.L('This Information Memorandum is being issued in the United Kingdom by the Company to, and/or is directed at, persons to whom it may lawfully be issued or directed at under The Financial Services and Markets Act 2000 (Financial Promotion) Order 2001 including persons who are authorised under the Act ("authorised persons"), certain persons having professional experience in matters relating to investments, high net worth companies, high net worth unincorporated associations or partnerships, trustees of high value trusts and persons who qualify as certified sophisticated investors. The Tokens are only available to such persons in the United Kingdom and this Information Memorandum must not be relied or acted upon by any other persons in the United Kingdom. In order to qualify as a certified sophisticated investor a person must: (a) have a certificate in writing or other legible form signed by an authorised person to the effect that he is sufficiently knowledgeable to understand the risks associated with participating in such investments; and (b) have signed, within the last 12 months, a statement in a prescribed form declaring, amongst other things, that he qualifies as a sophisticated investor in relation to such investments. This Information Memorandum is exempt from the general restriction in Section 21 of the Act on the communication of invitations or inducements to engage in investment activity on the grounds that it is being issued to and/or directed at only the types of person referred to above.')}</p>
                                <p>{it.L('The content of this Information Memorandum has not been approved by an authorised person and such approval is, save where this Information Memorandum is directed at or issued to the types of person referred to above, required by Section 21 of the Act. Acquiring Tokens may expose an investor to a significant risk of losing all of the amount invested. Any person who is in any doubt about investing in the Company should consult an authorised person specialising in advising on such investments.')}</p>
                                <p>{it.L('This Information Memorandum is an invitation to treat and may only be received by authorised persons. If an authorised person wishes to bid for Tokens he may do so if he has a binary.com account, by which method the Company shall be able to verify his qualifications as an authorised person. The prospective investor who wishes to acquire Tokens will make a bid.  The Company will collate and assess the bids.  The Company may request that bids are reconfirmed before they are considered valid for the purpose of the offer at the Auction.  At the Auction the Company will make an offer for the Tokens, which offer will be accepted (by the process explained below) by the bids, and the consideration for the purchase of such Tokens offered and accepted will be settled by credit in the prospective investor\'s Binary.com account, which evidences the contract for sale and purchase of the respective Tokens.')}</p>
                            </div>

                            <div id='hk' className='invisible'>
                                <p>{it.L('The Tokens may not be offered or sold in Hong Kong by means of any document other than (i) in circumstances which do not constitute an offer to the public within the meaning of the Companies Ordinance (Cap.32, Laws of Hong Kong), or (ii) to “professional investors” within the meaning of the Securities and Futures Ordinance (Cap.571, Laws of Hong Kong) and any rules made thereunder, or (iii) in other circumstances which do not result in the document being a “prospectus” within the meaning of the Companies Ordinance (Cap.32, Laws of Hong Kong), and no advertisement, invitation or document relating to the tokens may be issued or may be in the possession of any person for the purpose of issue (in each case whether in Hong Kong or elsewhere), which is directed at, or the contents of which are likely to be accessed or read by, the public in Hong Kong (except if permitted to do so under the laws of Hong Kong) other than with respect to Tokens which are or are intended to be disposed of only to persons outside Hong Kong or only to “professional investors” within the meaning of the Securities and Futures Ordinance (Cap. 571, Laws of Hong Kong) and any rules made thereunder.')}</p>
                            </div>

                            <div id='jp' className='invisible'>
                                <p>{it.L('The Tokens have not been and will not be registered under the Financial Instruments and Exchange Act, as amended (the “FIEA”). This document is not an offer of securities for sale, directly or indirectly, in Japan or to, or for the benefit of, any resident of Japan (which term as used herein means any person resident in Japan, including any corporation or entity organized under the laws of Japan) or to others for reoffer or resale, directly or indirectly, in Japan or to, or for the benefit of, any resident of Japan, except pursuant to an exemption from the securities registration requirements under the FIEA and otherwise in compliance with such law and any other applicable laws, regulations, and ministerial guidelines of Japan.')}</p>
                            </div>

                            <div id='eu' className='invisible'>
                                <p>{it.L('For the avoidance of doubt (and notwithstanding anything to the contrary), the material you may be provided with is not an offer for tokens; it is an invitation to treat.  Tokens will may only be offered by Binary Group Ltd. (the “Company”) pursuant to an auction in the manner more particularly described in the ‘token auction process’ section of the material.')}</p>
                                <p>{it.L('The material may only be received by authorised persons (a person determined by the Company, in its sole discretion, entitled to receive the materials as prescribed by applicable laws and regulations, for example in EEA jurisdictions, pursuant to an exemption under the European Union\'s directive 2003/71/EC (as amended, including by directive 2010/73/EU), which includes, without limitation, the exemption relating to qualified investors (“Authorised Persons”). If an Authorised Person wishes to bid for Tokens he may do so if he is registered client of the Company and has a Binary.com account, by which method the Company shall be able to verify his qualification as an Authorised Person. The Authorised Person who wishes to acquire tokens will make a bid.  The Company will collate and assess the bids.  The Company may request that bids are reconfirmed before they are considered valid for the purpose of the Company’s offer at the auction.  At the auction the Company will make an offer for the Tokens, which offer will be accepted (by the auction process explained in the materials) by the bids, and the consideration for the purchase of such Tokens offered and accepted will be settled by credit in the Authorised Person’s Binary.com account, which evidences the contract for sale and purchase of the respective Tokens.')}</p>
                                <p>{it.L('This website and the proposed ICO does not constitute an offer of, or an invitation to purchase, the aforementioned tokens in any jurisdiction in which such offer or sale would be unlawful. In particular, unless otherwise determined by the Company, and permitted by applicable law and regulation, it is not intended that any offering of the tokens should be made, or any documentation be sent, directly or indirectly, in or into, Australia, the British Virgin Islands, Canada,  Japan, Jersey, New Zealand, Singapore, South Africa, Switzerland, or the United States (“Restricted Territory”) and nor should it be accessed by any person who is a national citizen or resident of a Restricted Territory, including corporations, partnerships, or other entities created or organised in any such jurisdiction')}</p>
                                <p>{it.L('In relation to each member state of the European Economic Area that has implemented the Prospectus Directive (each, a “relevant member state”), with effect from and including the date on which the Prospectus Directive is implemented in that relevant member state (the “relevant implementation date”), an offer of Tokens described in this document may not be made to the public in that relevant member state, except that an offer to the public in that relevant member state may be made at any time under the following exemptions under the Prospectus Directive (to the extent that they have been implemented in that relevant member state): to any legal entity which is a qualified investor as defined in the Prospectus Directive; to fewer than 150 natural or legal persons (other than qualified investors as defined in the Prospectus Directive), as permitted under the Prospectus Directive; or in any other circumstances falling within Article 3(2) of the Prospectus Directive, provided that no such offer of Tokens shall require the Company to publish a prospectus pursuant to Article 3 of the Prospectus Directive. For purposes of this provision, the expression an “offer of Tokens to the public” in any relevant member state means the communication in any form and by any means of sufficient information on the terms of the offer and the Tokens to be offered so as to enable an investor to decide to purchase or subscribe for the Tokens, as the expression may be varied in that member state by any measure implementing the Prospectus Directive in that member state.')}</p>
                                <p>{it.L('In the case of any Tokens being offered to a financial intermediary as that term is used in Article 3(2) of the Prospectus Directive, such financial intermediary will also be deemed to have represented, warranted, and agreed to and with the Company that: (i) Tokens acquired by it have not been acquired on behalf of, nor have they been acquired with a view to their offer or resale to, persons in any relevant member state other than qualified investors; or (ii) where Tokens have been acquired by it on behalf of persons in any relevant member state other than qualified investors, the offer of those Tokens is not treated under the Prospectus Directive as having been made to such persons. The Company will rely on the truth and accuracy of the foregoing representation, warranty and agreement.')}</p>
                            </div>
                        </div>
                        <form id='frm_accept_second_notice' className='center-text'>
                            <label>
                                <input type='checkbox' id='checkbox-2' />
                                {' '}
                                <span>{it.L('I have read and understood the above and confirm that I am suitably qualified to receive the information hereafter.')}</span>
                            </label>
                            <p id='frm_accept_notice_error' className='error-msg invisible'>
                                {it.L('This field is required.')}
                            </p>
                            <div>
                                <button id='btn-submit'>{it.L('Submit')}</button>
                            </div>
                        </form>
                    </div>
                    <div className='gr-10 gr-push-1 invisible' id='access_denied_msg'>
                        <h3>{it.L('Access Denied')}</h3>
                        <p className='text-uppercase disclaimer-container'>
                            {it.L('The information included in this section is restricted due to applicable securities laws in your country of residence. The information in this section of the website is, therefore, not available to persons located in your country of residence.')}
                        </p>
                    </div>
                    <div className='gr-10 gr-push-1 invisible' id='disclaimer_msg'>
                        <h1>{it.L('Disclaimer')}</h1>
                        <div className='disclaimer-container'>
                            <p>{it.L('ELECTRONIC VERSIONS OF THE MATERIALS YOU ARE SEEKING TO ACCESS ARE BEING MADE AVAILABLE ON THIS WEBPAGE BY BINARY GROUP LTD. IN GOOD FAITH AND FOR INFORMATION PURPOSES ONLY.')}</p>
                            <p>{it.L('Please read this notice carefully - it applies to all persons who view this webpage. Please note that the disclaimer set out below may be altered or updated, at any time in whole or in part at the sole discretion of Binary Group Ltd. (“Company”). You should read it in full each time you visit the site.')}</p>
                            <p>{it.L('Viewing the materials available hereafter may not be lawful in certain jurisdictions. In other jurisdictions, only certain categories of person may be allowed to view such materials. Any person who wishes to view these materials must first satisfy themselves that they are not subject to any local requirements that prohibit or restrict them from doing so. In particular, unless otherwise determined by the Company and permitted by applicable law and regulation, it is not intended that any offering of the tokens mentioned in such materials (the "Tokens") by the Company should be made, or any documentation be sent, directly or indirectly, in or into, Australia, the British Virgin Islands, Canada,  Japan, Jersey, New Zealand, Singapore, South Africa, Switzerland, or the United States (each, a “Restricted Territory”) and nor should it be accessed by any person who is a national citizen or resident of a Restricted Territory, including corporations, partnerships, or other entities created or organised in any such jurisdiction.')}</p>
                            <p>{it.L('The materials are for information purposes only and do not constitute or form a part of any offer or invitation to sell or issue, or solicitation of any offer, to purchase or subscribe for the Tokens in any jurisdiction or jurisdictions in which such offers or sales are unlawful prior to registration or qualification under the securities laws of any such jurisdiction. In particular, the Tokens have not been and will not be registered under the US Securities Act of 1933, as amended (the "Securities Act"), and may not be offered, sold, resold, pledged, taken up, exercised, renounced, transferred or delivered, directly or indirectly, in or into the United States except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the Securities Act. The Securities will not be registered under applicable securities laws of any state, province, territory, county or jurisdiction of a Restricted Territory.')}</p>
                            <p>{it.L('Accordingly, unless an exemption under the relevant securities law is applicable, the Tokens may not be offered, sold, pledged, taken up, exercised, resold, renounced, transferred or delivered, directly or indirectly, in or into a Restricted Territory where to do so would constitute a violation of the relevant laws of, or require registration thereof in, such jurisdiction.')}</p>
                            <p>{it.L('There will be no public offering of the Tokens in the United States. If you are not permitted to view materials on this webpage or are in any doubt as to whether you are permitted to view these materials, please exit this webpage.')}</p>

                            <h2>{it.L('Basis of access')}</h2>
                            <p>{it.L('For the avoidance of doubt (and notwithstanding anything to the contrary), the material you may be provided with is not an offer for tokens; it is an invitation to treat.  Tokens will may only be offered by the Company pursuant to an auction in the manner more particularly described in the ‘token auction process’ section of the material.')}</p>
                            <p>{it.L('The material may only be received by authorised persons (a person determined by the Company, in its sole discretion, entitled to receive the materials as prescribed by applicable laws and regulations, for example in EEA jurisdictions, pursuant to an exemption under the European Union\'s directive 2003/71/EC (as amended, including by directive 2010/73/EU), which includes, without limitation, the exemption relating to qualified investors (“Authorised Persons”). If an Authorised Person wishes to bid for Tokens he may do so if he is registered client of the Company and has a Binary.com account, by which method the Company shall be able to verify his qualification as an Authorised Person. The Authorised Person who wishes to acquire tokens will make a bid.  The Company will collate and assess the bids.  The Company may request that bids are reconfirmed before they are considered valid for the purpose of the Company’s offer at the auction.  At the auction the Company will make an offer for the Tokens, which offer will be accepted (by the auction process explained in the materials) by the bids, and the consideration for the purchase of such Tokens offered and accepted will be settled by credit in the Authorised Person’s Binary.com account, which evidences the contract for sale and purchase of the respective Tokens.')}</p>
                            <p>{it.L('Access to electronic versions of these materials is being made available on this webpage by the Company in good faith and for information purposes only. It does not constitute an offer of, or an invitation to purchase, the aforementioned tokens or any securities.  Making press announcements and other documents available in electronic format does not constitute, or shall not be deemed to constitute, or form part of, an offer to sell or the solicitation of an offer to buy or otherwise deal in the Tokens or any other securities. Further, it does not constitute a recommendation by the Company or any other party to sell or buy Tokens or any other securities.')}</p>
                            <p>{it.L('All information is provided without any warranties of any kind and the Company, its employees, officers and/or advisors make no representations and disclaim all express and implied warranties and conditions of any kind, including, without limitation, representations, warranties or conditions regarding accuracy, timeliness, completeness, non-infringement, suitability of the Tokens for any prospective investor, and each of the Company, its employees, officers and/or professional advisors assume no responsibility to you or any third party for the consequence of errors or omissions.')}</p>
                            <p>{it.L('The information contained on this webpage and documents posted thereon may contain statements that are deemed to be “forward looking statements”. Such statements are prospective in nature. All statements other than historical statements of facts may be forward-looking statements. Statements containing the words “targets”, “plans”, “believes”, “expects”, “aims”, “intends”, “will”, “may”, “anticipates”, “estimates”, “projects” or “considers” or other similar words may be forward-looking statements.')}</p>
                            <p>{it.L('Forward looking statements inherently contain risks and uncertainties as they relate to events or circumstances in the future. Users of this webpage should not place undue reliance on forward-looking statements. The Company expressly disclaims any obligation or undertaking to update or revise any forward-looking statements except to the extent required by law and neither the Company, its employees, officers or professional advisors make any assurance, representation or guarantee that any event referred to in a forward-looking statement will actually occur.')}</p>
                            <p>{it.L('Unless otherwise determined by the Company and permitted by applicable law and regulation, copies of the contents of the following pages (including documents posted thereon) are not being, and must not be, released or otherwise distributed or transmitted in or into a Restricted Territory and persons receiving such documents (including custodians, nominees and trustees) must not distribute, forward to or transmit them in or into a Restricted Territory.')}</p>
                            <p>{it.L('The Company makes no representations that the information contained in this site is appropriate or available for use in other locations. The Company shall not have any responsibility in respect of access to it from territories whose laws prohibit such access or where any aspect of the content of the site may be illegal. Those who choose to access this site from other locations do so on their own initiative and at their own risk, and are responsible for compliance with applicable local laws.')}</p>

                            <h2>{it.L('Confirmation of understanding and acceptance of disclaimer')}</h2>
                            <p>{it.L('BY CLICKING ON THE "AGREE" BUTTON, YOU CERTIFY (BOTH TO BINARY GROUP LTD., ITS EMPLOYEES, OFFICERS AND ITS ADVISORS) THAT:')}</p>

                            <ul className='bullet'>
                                <li>{it.L('YOU CONFIRM THAT THE MATERIALS ARE AN INVITATION TO TREAT AND NOT AN OFFER FOR ANY TOKEN OR SECURITIES;')}</li>
                                <li>{it.L('IN ORDER TO MAKE A BID FOR A TOKEN YOU MUST BE A BINARY.COM REGISTERED CLIENT WITH A BINARY.COM ACCOUNT, AND THAT YOU WILL PROVIDE BINARY GROUP LTD. WITH REQUESTED WRITTEN CERTIFICATIONS AS TO YOUR STATUS TO CONFIRM YOU ARE AN AUTHORISED PERSON;')}</li>
                                <li>{it.L('YOU CONFIRM THAT IF YOU ARE DEEMED BY BINARY GROUP LTD. TO NOT BE AN AUTHORISED PERSON YOU WILL DESTROY THE MATERIAL AND WILL NOT DISTRIBUTE IT TO THIRD PARTIES;')}</li>
                                <li>{it.L('YOU ARE NOT IN THE UNITED STATES OR ANY OTHER RESTRICTED TERRITORY;')}</li>
                                <li>{it.L('YOU ARE NOT A U.S. PERSON (AS DEFINED IN RULE 902 OF THE SECURITIES ACT) OR OTHERWISE RESIDENT IN THE UNITED STATES OR ANY OTHER RESTRICTED TERRITORY;')}</li>
                                <li>{it.L('YOU ARE NOT INVESTING OR OTHERWISE ACTING FOR THE ACCOUNT OR BENEFIT OF A U.S. PERSON OR A RESIDENT OF THE UNITED STATES OR ANY OTHER RESTRICTED TERRITORY;')}</li>
                                <li>{it.L('YOU HAVE COMPLIED WITH ALL APPLICABLE SECURITIES LAWS AND ARE ABLE TO RECEIVE THE CONTENTS OF THE FOLLOWING PAGES (INCLUDING DOCUMENTS POSTED THEREON);')}</li>
                                <li>{it.L('YOU REPRESENT AND WARRANT THAT YOU ARE ACCESSING THESE WEBPAGES FOR INFORMATION PURPOSES ONLY;')}</li>
                                <li>{it.L('YOU REPRESENT AND WARRANT THAT SHOULD YOU WISH TO MAKE ANY INVESTMENT IN BINARY GROUP LTD. OR PURCHASE OR SUBSCRIBE FOR ANY TOKENS YOU WILL SATISFY YOURSELF AS TO FULL OBSERVANCE OF THE LAWS OF ANY RELEVANT TERRITORY IN CONNECTION WITH ANY SUCH INVESTMENT INCLUDING OBTAINING ANY REQUISITE GOVERNMENTAL OR OTHER CONSENTS THAT MAY BE REQUIRED AND AS TO DUE AND PROPER COMPLIANCE THEREWITH; AND')}</li>
                                <li>{it.L('YOU HAVE READ, UNDERSTOOD AND AGREE TO THE DISCLAIMER ABOVE.')}</li>
                            </ul>
                        </div>
                        <form id='frm_accept_disclaimer' className='center-text'>
                            <label>
                                <input type='checkbox' id='checkbox' />
                                {' '}
                                <span>
                                    {it.L('I UNDERSTAND THAT THE DISCLAIMER ABOVE MAY AFFECT MY RIGHTS. I AGREE TO BE BOUND BY ITS TERMS.')}
                                </span>
                            </label>
                            <p id='frm_accept_disclaimer_error' className='error-msg invisible'>
                                {it.L('You must accept the disclaimer to be able to view this content.')}
                            </p>
                            <div>
                                <button id='btn-submit'>{it.L('Submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <script src={it.url_for(`js/landing_pages/common.js?${it.static_hash}`)} />
            <script src={it.url_for(`js/landing_pages/ico_disclaimer.js?${it.static_hash}`)} />
        </body>
    </html>
);

export default IcoDisclaimer;
