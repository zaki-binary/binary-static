//var express = require('express');
//var 
//var router = express.Router();
//var haml = require('hamljs');

//var app = express();

//// view engine setup

//app.engine('.haml', require('hamljs').renderFile);
//app.set('view engine', '.haml');


//app.use(express.static(path.join(__dirname, '../../src/templates/haml')));


//router.get('/', function (req, res) {
//    res.render('index', { title: 'Express' });
//    console.log('MAIN!');
//});


//








var express = require('express'),
    path = require('path'),
    consolidate = require('consolidate'),
    app = express();

app.engine('html', consolidate.haml);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../../src/templates/haml'));


app.get('/', function (req, res) {
    res.render('index', {
        title: 'Consolidate.js'
    });
});


app.set('port', process.env.PORT || 1337);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});