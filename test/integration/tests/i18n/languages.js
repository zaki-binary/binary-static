var languages = [
    { code: 'EN', language: 'English', translation: 'GET STARTED' },
    { code: 'DE', language: 'Deutsch', translation: 'LOS GEHT\'S' },
    { code: 'ID', language: 'Bahasa Indonesia', translation: 'MEMULAI' },
    { code: 'ZH_CN', language: '简体中文', translation: '现在就开始' },
    { code: 'PL', language: 'Polish', translation: 'ROZPOCZNIJ' },
    { code: 'RU', language: 'Русский', translation: 'С ЧЕГО НАЧАТЬ' },
    { code: 'PT', language: 'Português', translation: 'COMEÇAR' },
    { code: 'ES', language: 'Español', translation: 'COMENZAR' },
    { code: 'FR', language: 'Français', translation: 'SE LANCER' }
];

languages.forEach(function(l) {
    module.exports[l.language] = function(browser) {
        browser
            .url(browser.launch_url + '?l=' + l.code)
            .waitForElementVisible('body', 5000)
            .assert.containsText('body', l.translation)
        .end();
    };
});