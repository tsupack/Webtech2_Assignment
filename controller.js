const express = require('express');
const router = express.Router();

var UserService = require('./userService');
const userService = new UserService();

router.get('/',function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});

router.post('/login', (req, res) => {
    if(req.body['username'] != null){
        if(req.body['password'] != null){
            userService.loginUser(req.body['username'], req.body['password'],(response) => {
                if(response === "customer"){
                    res.status(200).sendFile(__dirname + '/public/customer.html');
                }
                else if(response === "worker"){
                    res.status(200).sendFile(__dirname + '/public/worker.html');
                }
                else if(response === "manager"){
                    res.status(200).sendFile(__dirname + '/public/manager.html');
                }
                else if(response == null){
                    res.status(500).sendFile(__dirname + '/public/index.html');
                }
            })
        }
    }
});

router.get('/listUsers', (req, res) => {
    userService.listUsers((response) => {
        res.status(200).send(response)
    })
});

router.post('/register', (req, res) => {
    userService.registerUser(
        {name : req.body.name, email : req.body.email, username : req.body.username, password : req.body.username, rank : "customer"},
        () => {res.status(200).sendFile(__dirname + '/public/index.html')},
        (cause) => {res.status(500).send(cause)}
    )
});

module.exports = router;