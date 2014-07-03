module("Client");
test('not_logged_in', function() {
    var cookie_name = 'loginid';
    var expdate = new Date();                                                                          
    expdate.setTime(expdate.getTime() - (24 * 60 * 60 * 1000));
    var subdomain = '.' + document.domain.split('.').slice(-2).join('.');
    $.cookie(cookie_name, null, { expires: expdate, path: '/', domain: subdomain});
    var client = new Client();
    equal(client.type, "logged_out", "Client is logged out");
    ok(!client.is_logged_in, "Not Logged in");
    ok(!client.is_real, "Not Real");
    ok(!client.loginid, "No Login id");
});

test('virtual', function() {
    var cookie_name = 'loginid';
    var subdomain = '.' + document.domain.split('.').slice(-2).join('.');
    $.cookie(cookie_name, 'VRTC123456', { path: '/', domain: subdomain});
    var client = new Client();
    equal(client.type, "virtual", "Client is virtual");
    ok(client.is_logged_in, "Logged in");
    ok(!client.is_real, "Not Real");
    equal(client.loginid, 'VRTC123456', "Login id");
});

test('real', function() {
    var cookie_name = 'loginid';
    var subdomain = '.' + document.domain.split('.').slice(-2).join('.');
    $.cookie(cookie_name, 'CR123456', { path: '/', domain: subdomain});
    var client = new Client();
    equal(client.type, "real", "Client is real");
    ok(client.is_logged_in, "Logged in");
    ok(client.is_real, "Real");
    equal(client.loginid, 'CR123456', "Login id");
});

module("Url");
test('custom location', function() {
    var url = new URL("http://www.binary.com/page?l=EN&type=123");
    equal(url.location.search, "?l=EN&type=123");
    var params = url.params();
    equal(params.length, 2, "Correct count");
    equal(url.param('l'), 'EN', "Param l");
    equal(url.param('type'), '123', "param type");
    ok(!url.param('mumbo'), "no param mumbo");

    var url2 = new URL("http://www.binary.com/page?l=EN&type=123&tenor=55");
    ok(url.path_matches(url2), "url and url2 has same path");
    ok(url.is_in(url2), "url is in url2");

    var url3 = new URL("http://www.bianary.com/page2?l=EN&type=123");
    ok(!url.path_matches(url3), "url and url3 does not have same path");
    ok(!url.is_in(url3), 'url is not in url3');

    var url4 = new URL("http://www.binary.com/page?l=EN");
    ok(url.path_matches(url2), "url and url4 has same path");
    ok(!url.is_in(url4), 'url is not in url4');

    var encoded_url = new URL('http%3A%2F%2Fwww.binary.com%2Fpage%3Fstr%3Dstring');
    equal(encoded_url.param('str'), 'string');

    var relative_url = new URL('//www.binary.com/page');
    ok(relative_url.path_matches(url), "relative_url and url has same path");
    ok(relative_url.is_in(url), "Relative url is in page");
});

var expdate = new Date();
expdate.setTime(expdate.getTime() - (24 * 60 * 60 * 1000));
var subdomain = '.' + document.domain.split('.').slice(-2).join('.');
$.cookie('loginid', null, { expires: expdate, path: '/', domain: subdomain});

module("Page");
test('settings', function() {
    var page =  new Page({settings: {"name" : "PBody", "languages": [ "EN", "TESRA"], "score" : { "level1": 30}}}); 
    equal(page.settings.get("name"), "PBody", "get");
    ok(typeof page.settings.get("languages"), "object", "language Object");
    equal(page.settings.get("languages")[1], "TESRA", "get array");
    ok(typeof page.settings.get("score"), "object", "score Object");
    equal(page.settings.get("score")['level1'], 30, "get hash");


    page.settings.set("name", "TRex");
    equal(page.settings.get("name"), "TRex", "set");
});


