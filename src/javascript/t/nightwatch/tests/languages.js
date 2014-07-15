var languages = [
    { code: 'EN', language: 'English', translation: 'Get Started' },
    { code: 'DE', language: 'Deutsch', translation: 'Los geht\'s' },
    { code: 'ID', language: 'Bahasa Indonesia', translation: 'Memulai' },
    { code: 'ZH_CN', language: '简体中文', translation: '现在就开始' },
    { code: 'PL', language: 'Polish', translation: 'Rozpocznij' },
    { code: 'RU', language: 'Русский', translation: 'С чего начать' },
    { code: 'PT', language: 'Português', translation: 'Começar' },
    { code: 'ES', language: 'Español', translation: 'Comenzar' },
    { code: 'FR', language: 'Français', translation: 'Se lancer' }
];

languages.forEach(function(l) {
    module.exports[l.language] = function(browser) {
        browser
            .url("https://www.binary-beta.com?l=" + l.code)
            .waitForElementVisible('body', 5000)
            .assert.containsText('body', l.translation)
        .end();
    };
});