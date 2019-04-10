var express = require('express');
var bodyParser = require('body-parser');

var app = express();
const port = 8088;

app.use(bodyParser.json());

//const shutterController = require('./shutterController')
//app.use('/',shutterRequestController)

app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`)
});
