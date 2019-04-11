var express = require('express');
var bodyParser = require('body-parser');

var app = express();
const port = 8088;

app.use(bodyParser.json());

const controller = require('./controller')
app.use('/',controller)

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
});
