var util = require('util'),
    fs = require('fs'),
    haml = require('hamljs');

var options = {
    locals: {
        title: 'Welcome',
        body: 'wahoo',
        usersOnline: 15
    }
};

var page = '../../src/templates/haml/layouts/get_started.html.haml'; // 'page.haml'

util.puts(haml.render(fs.readFileSync(page), options))