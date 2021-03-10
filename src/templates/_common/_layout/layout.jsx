import React from 'react';
import Head from './head.jsx';
import Header from './header.jsx';
import MobileMenu from './mobile_menu.jsx';
import Footer from './footer.jsx';
import InterviewPopup from '../components/interview_popup.jsx';
import Title from '../components/title.jsx';
import Elevio from '../includes/elevio.jsx';
import LiveChat from '../includes/livechat.jsx';

export const CONTENT_PLACEHOLDER = 'CONTENT_PLACEHOLDER';

export const WithLayout = ({ children }) => {
    const content_class = `${it.current_route || ''}-content`;
    return (
        <div id='content' className={it.current_route ? content_class : undefined}>
            <div id='page_info' style={{ display: 'none' }}>
                <Title />
                <div id='content_class'>{content_class}</div>
            </div>
            {it.layout !== 'full_width' ?
                <div className='container'>
                    {children}
                </div> :
                children
            }
        </div>
    );
};

const InnerContent = () => (
    it.layout ?
        <WithLayout> {CONTENT_PLACEHOLDER} </WithLayout>
        : CONTENT_PLACEHOLDER
);

const Layout = () => {
    if (it.is_pjax_request) {
        return <InnerContent />;
    }

    return (
        <html>
            <Head />
            <body className={it.language}>
                <div id='msg_notification' className='notice-msg center-text' />
                <div id='page-wrapper'>
                    <Header />
                    <div id='content-holder'>
                        <MobileMenu />
                        <a href='javascript:;' id='scrollup' />
                        <InnerContent />
                    </div>
                    <Footer />
                </div>
                <InterviewPopup /> {/* TODO: remove when UX research is finished */}
                <Elevio />
                <LiveChat />
            </body>
        </html>
    );
};

export default Layout;
