import React from 'react';

const Privacy = () => (
    <div>
        <h2>{it.L('Privacy & Security')}</h2>
        <p>{it.L('We recognize the importance of protecting your personal and financial information.')}</p>
        <p>{it.L('The personal information that we obtain about you assists us in servicing your account. We know you may be concerned about what we do with this information, and with financial information about your account. The following outlines our privacy practices.')}</p>

        <h2>{it.L('Use of Information')}</h2>
        <p>{it.L('The Data Protection laws and regulations place obligations on users of personal data and lay down principles for fair and lawful processing of this information. We are committed to safeguarding your privacy online. We only use your personal information to help us service your account, to improve our services to you, and to provide you with products you have requested. We do not sell your personal information to third parties, but we may provide your personal information to payment providers to facilitate transactions on your account.')}</p>
        <p>{it.L('Your personal information is used primarily as a way of authenticating you as the proper owner of your account and as the person to whom withdrawal payments may be made, and to process trades. We collect personal data relating to you directly from you when you fill in the account opening form. In the event of any doubt as to the authenticity of your account details or of any withdrawal request, the company reserves the right to request further authentication information as may be deemed appropriate under the circumstances.')}</p>
        <p>{it.L('The above personal data that we collect will be held by us and processed for any purpose as may be allowed by law or required by any law. We may also transfer such personal data to any company within the Binary Group of companies, any of our business associates or payment providers, whether in or outside of the EEA including in countries which might not offer an equivalent level of protection of personal data.')}</p>
        <p>{it.L('Please note that our website generates log files that record the IP addresses of accesses to your account. This information is gathered with the sole purpose of assisting in the unlikely event of a need to investigate accesses to your account by unauthorised users. Additionally we may verify certain of the information you supply in the account opening form, or otherwise, with third-party information providers.')}</p>
        <p>{it.L('Please note that you may update your personal information at any time by logging into the "Settings" section of your account. It is your responsibility to ensure that [_1] is promptly and continually informed of any change in your personal information.', it.website_name)}</p>
        <p>{it.L('By using or interacting with the website, you are consenting to the use of the Google Analytics User ID Feature, which allows Google to capture your [_1] login ID (for e.g., VRTC1234, CR1234, MF1234, etc.). No other personally identifiable information other than your [_1] login ID, or other data which can be linked to such information by Google, is shared with or disclosed to Google by enabling the Google Analytics User ID Feature.', it.website_name)}</p>
        <p>{it.L('We also collect basic tax residence information for the purposes of CRS/FATCA compliance. The tax information you provide may only be disclosed to the authorities legally charged with collecting this information for the purposes of CRS/FATCA reporting and only to the extent to which BIEL is legally obliged to collect and disclose it. This information shall not be used, disclosed or processed in any other way at any time.')}</p>

        <h2>{it.L('Access to Personal Data')}</h2>
        <p>{it.L('Access to your personal data is strictly prohibited with the exception of key personnel of the Company and only as needed in the performance of their duties.')}</p>
        <p>{it.L('If the Company is legally required to disclose your personal or financial information by law, regulation or pursuant to the order of a court of competent jurisdiction or a governmental agency, the Company  shall, unless legally prohibited, promptly notify you to that effect, in order to give you the opportunity to seek such protection for the information as it deems appropriate. Such required disclosure shall not be construed as a breach of this Terms and Conditions Agreement.')}</p>

        <h2>{it.L('Security Statement')}</h2>
        <p>{it.L('We are committed to making sure your personal data and transactions are secure:')}</p>
        <ol>
            <li>{it.L('Your password and login ID are unique and passwords are hashed so that not even [_1] staff can read them. This is the reason why we cannot retrieve your password and have to issue you with a new one to your email address if you cannot recall it.', it.website_name)}</li>
            <li>{it.L('We maintain customer balances in cash or cash equivalent. We ensure that 100% of each customer\'s balance is available for immediate withdrawal, subject to verification.')}</li>
            <li>{it.L('All credit card details are submitted directly to the Visa/Mastercard network using the latest SSL encryption technology, in accordance with bank policies.')}</li>
            <li>{it.L('Our information security policies are based on industry best practices in access control and business continuity.')}</li>
            <li>{it.L('We use identity verification services and real-time fraud detection measures to help protect you from unauthorised access to your account. We also monitor account activity for signs of unusual activity that might indicate fraud and work with collection agencies and law-enforcement agencies to address fraud issues.')}</li>
        </ol>
        <br />

        <h2>{it.L('Cookies')}</h2>
        <p>{it.L('This website does not collect personally identifying information about you except when you specifically and knowingly provide it. There is a technology called "cookies" which can be used to provide tailored information from a website. A cookie is an element of data that a website can send to your browser, which may then store it on your system. You can set your browser to notify you when you receive a cookie, giving you the chance to decide whether to accept it. If you do not accept the cookie, then you will need to input your loginID and password again at every form required to enter into the system. You are advised to choose this option if you have concerns about the security of your personal browser or PC.')}</p>

        <h2>{it.L('Links')}</h2>
        <p>{it.L('This website contains links to other websites and may contain banner or icon advertisements related to third-party websites. These websites and the advertisements thereof may submit cookies onto your web browser and as such are beyond our control. We are not responsible for the privacy practices or the content of such websites. We encourage you to read the privacy policies of these websites, because their practices may differ from ours.')}</p>

        <h2>{it.L('Notification of Changes')}</h2>
        <p>{it.L('Any changes in our privacy policy or security statement will be posted onto this website. In the event of material changes that directly affect the economic use of your personal information, we will request your prior authorisation in writing before effecting such change on your account.')}</p>
        <p>{it.L('You also have the right to request from us to inform you about the personal data that we process about you and to request its correction where necessary. This request must be made in writing to us and signed by you as the data subject.')}</p>
    </div>
);

export default Privacy;
