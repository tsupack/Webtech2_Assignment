var express = require('express');
const appRoot = require('app-root-path');
var bodyParser = require('body-parser');

var app = express();
const port = 8088;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const controller = require(`${appRoot}/app/src/controller/controller`);

app.use('/', controller);

app.use('/', express.static('client/build', {index: 'index.html'}));

app.listen(port, () => {
    console.log(`Server is listening on ${port}.`)
});
