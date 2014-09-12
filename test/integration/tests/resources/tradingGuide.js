var URL = require('../../url');

var element = {
    riseFallSeeDemoLink: '.bet_demo_link:nth-child(1)',
    higherLowerSeeDemoLink: '.bet_demo_link:nth-child(2)',
    touchNoTouchSeeDemoLink: '.bet_demo_link:nth-child(3)',
    inOutSeeDemoLink: '.bet_demo_link:nth-child(4)',
    demoPopup: '.inpage_popup_container ui-draggable',
    closeButton: '.close'
};

module.exports = {

    "tradingGuide": function (browser) {

        browser
            .url(browser.launch_url + URL.RESOURCES.TRADING_GUIDE)
            .waitForElementVisible('body', 5000)
        
            .click(element.riseFallSeeDemoLink)
            .pause(1000)
            .assert.visible(element.demoPopup)
            .click(element.closeButton)
        
            .click(element.higherLowerSeeDemoLink)
            .pause(1000)
            .assert.visible(element.demoPopup)
            .click(element.closeButton)
        
            .click(element.touchNoTouchSeeDemoLink)
            .pause(1000)
            .assert.visible(element.demoPopup)
            .click(element.closeButton)
        
            .click(element.inOutSeeDemoLink)
            .pause(1000)
            .assert.visible(element.demoPopup)
            .click(element.closeButton)

        .end();
    }
};
