var express = require('express');
var path = require('path');

var port = 3030;
var app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './app/index.html'));
});

app.use(express.static('app'))

app.listen(port);
console.log('Listening on port ' + port);