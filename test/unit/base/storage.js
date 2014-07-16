module("Storage Objects");
test( "Default InScriptStore", function() {
    var store = new InScriptStore();
    store.set("test", "Test");
    equal(store.get('test'), 'Test', "Stored");
    store.set("test", "Test2");
    equal(store.get('test'), 'Test2', "Updated");
    store.clear();
    equal(store.get('test'), undefined,  "Cleared");
});

test("Custom Object InScriptStore", function() {
    var data = {};
    var store = new InScriptStore(data);
    store.set("test", "Test");
    equal(store.get('test'), 'Test', "Stored");
    store.set("test", "Test2");
    equal(store.get('test'), 'Test2', "Updated");
    store.clear();
    equal(store.get('test'), undefined,  "Cleared");
});

test("Store sessionStore", function() {
    var store = new Store(window.sessionStorage);
    store.set("test", "Test");
    equal(store.get('test'), 'Test', "Stored");
    store.set("test", "Test2");
    equal(store.get('test'), 'Test2', "Updated");
    store.clear();
    equal(store.get('test'), undefined,  "Cleared");
});

test("Store localStore", function() {
    var store = new Store(window.localStorage);
    store.set("test", "Test");
    equal(store.get('test'), 'Test', "Stored");
    store.set("test", "Test2");
    equal(store.get('test'), 'Test2', "Updated");
    store.clear();
    equal(store.get('test'), undefined,  "Cleared");
});

test("CookieStorage", function() {
    var cookie_name = 'settings';
    var expdate = new Date();                                                                          
    expdate.setTime(expdate.getTime() - (24 * 60 * 60 * 1000));
    var subdomain = '.' + document.domain.split('.').slice(-2).join('.');

    //Delete all forms of settings cookies
    $.cookie(cookie_name, null, { expires: expdate, path: '/', domain: subdomain});
    $.cookie(cookie_name, null, { expires: expdate, path: '/', domain: document.domain});

    var store = new CookieStorage(cookie_name);
    ok(store.domain, subdomain, "Cookie domain");

    store.set('test', 'Test');
    equal(store.get('test'), 'Test', "Stored");

    var cookie = JSON.parse($.cookie(cookie_name));
    equal(cookie['test'], 'Test', 'Cookie Set & Readable');

    store.set('test', 'Test2');
    equal(store.get('test'), 'Test2', "Updated");

    $.cookie(cookie_name, null, { expires: expdate, path: '/', domain: subdomain});
    store = new CookieStorage(cookie_name);
    equal(store.get('test'), undefined, "Parse when null");

    $.cookie(cookie_name, '', { expires: expdate, path: '/', domain: subdomain});
    store = new CookieStorage(cookie_name);
    equal(store.get('test'), undefined, "Parse when empty string");

    $.cookie(cookie_name, '{}', { expires: expdate, path: '/', domain: subdomain});
    store = new CookieStorage(cookie_name);
    equal(store.get('test'), undefined, "Parse when {}");

});

test('localize', function() {
    var texts = { Jan: 'Jan', Feb: 'Feb', Mar: 'Mär', Apr: 'Apr', May: 'Mai', Jun: 'Jun', Jul: 'Jul', Aug: 'Aug', Sep: 'Sep', Oct: 'Okt', Nov: 'Nov', Dec: 'Dez', Failed_to_update_trade_description_: 'Aktualisierung der Handelsbeschreibung fehlgeschlagen.'};
    ;
    var localizable = new Localizable(texts);
    var l = localizable.localize;

    equal(localizable.localize('Mar'), 'Mär');
    equal(localizable.localize('Failed to update trade description.'), 'Aktualisierung der Handelsbeschreibung fehlgeschlagen.');
});

test('localize 10,000 times', function() {
    var texts = { Jan: 'Jan', Feb: 'Feb', Mar: 'Mär', Apr: 'Apr', May: 'Mai', Jun: 'Jun', Jul: 'Jul', Aug: 'Aug', Sep: 'Sep', Oct: 'Okt', Nov: 'Nov', Dec: 'Dez', Failed_to_update_trade_description_: 'Aktualisierung der Handelsbeschreibung fehlgeschlagen.'} ;
    var localizable = new Localizable(texts);

    var count = 10000;
    while(count--) {
        localizable.localize('Failed to update trade description.');
    }

    ok(1 == 1);
});
