/**
 * Very simple express server useful for debugging the application
 * in a web browser.
 *
 * To run:
 *
 * `$ npm start`
 * 
 * Or:
 *
 * `$ node index.js`
 *
 * The application will not work in a standard browser because
 * of cross-domain security. In order to bypass you can run Chrome
 * in disabled security mode:
 *
 * `$ grunt exec:insecure_chrome`
 */

var express = require('express');
var app = express();

app.use('/fonts', express.static('./debug/application/fonts'));

app.get('/app.js', function (req, res) {
    res.sendfile('./debug/application/app.js');
});

app.get('/styles.css', function (req, res) {
    res.sendfile('./debug/application/styles.css');
});

app.get('/', function (req, res) {
    res.sendfile('./debug/application/index.html');
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('GB Player Development server listening at http://localhost:%s', port);
});