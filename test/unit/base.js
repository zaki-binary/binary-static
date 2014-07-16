module("Global Settings");
test("JQuery Cookie Settings", function() {
    ok(!$.cookie.json, "This global variable should not be set");
});

module("Global Objects");
test("SessionStore", function() {
    ok(SessionStore instanceof Store, "SessionStore is a Store");
});

test("LocalStore", function() {
    ok(LocalStore instanceof Store, "LocalStore is a Store");
});

test("Settings", function() {
    ok(Settings instanceof CookieStorage, "Settings is a CookieStorage");
    equal(Settings.cookie_name, 'settings');
});
