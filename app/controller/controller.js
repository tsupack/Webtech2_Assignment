var express = require('express');
var router = express.Router();
const appRoot = require('app-root-path');

var UserService = require(`${appRoot}/app/service/userService`);
const userService = new UserService();

// START OF USER REQUESTS SECTION

//Tries to "login" a user from request data.
router.post('/login', (req, res) => {
    if(req.body.username != null){
        if(req.body.password != null){
            userService.loginUser(req.body.username, req.body.password,(response) => {
                if(response === "customer"){
                    res.status(200).sendFile(`${appRoot}/public/customer.html`);
                }
                else if(response === "worker"){
                    res.status(200).sendFile(`${appRoot}/public/worker.html`);
                }
                else if(response === "manager"){
                    res.status(200).sendFile(`${appRoot}/public/manager.html`);
                }
                else if(response == null){
                    res.status(400).sendFile(`${appRoot}/public/index.html`);
                }
            })
        }
    }
});

//Registers a user by the data from the request.
router.post('/register', (req, res) => {
    userService.getMaxUserId((maxID) => {
        userService.registerUser(
            {
                userID: (maxID + 1),
                name : req.body.name,
                email : req.body.email,
                username : req.body.username,
                password : req.body.password,
                rank : "customer"
            },
            () => {
                res.status(200).sendFile(`${appRoot}/public/index.html`)
            },
            (cause) => {
                res.status(400).send(cause)
            }
        )
    });
});

//For debug purposes only.
router.get('/listUsers', (req, res) => {
    userService.listUsers((response) => {
        res.status(200).send(response);
    })
});

// END OF USER REQUESTS SECTION

module.exports = router;