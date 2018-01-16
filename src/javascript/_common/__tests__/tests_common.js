const { LiveApi } = require('binary-live-api');
const expect      = require('chai').expect;
const jsdom       = require('jsdom');
const websocket   = require('ws');
const Language    = require('../language');
const Url         = require('../url');

const setURL = (url) => {
    jsdom.changeURL(window, url);
    Url.reset();
    Language.reset();
};

const setJPClient = () => {
    setURL(`${Url.websiteUrl()}ja/home-jp.html`);
};

module.exports = {
    expect,
    setURL,
    setJPClient,
    getApiToken: () => 'hhh9bfrbq0G3dRf',
    api        : new LiveApi({ websocket, appId: 1 }),
};
