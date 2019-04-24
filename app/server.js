var express = require('express');
const appRoot = require('app-root-path');
var app = express();
const port = 8088;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const controller = require(`${appRoot}/app/controller/controller`);

app.use('/', controller);

app.use(express.static(`${appRoot}/public`));
app.use('/', express.static('public', {index: 'index.html'}));

app.listen(port, () => {
    console.log(`Server is listening on ${port}.`)
});
