var express = require('express');
var router = express.Router();
const appRoot = require('app-root-path');

var UserService = require(`${appRoot}/app/service/userService`);
const userService = new UserService();

var OrderService = require(`${appRoot}/app/service/orderService`);
const orderService = new OrderService();

var userName = null;
var userRank = null;
var userEmail = null;
var loggedIn = false;

// START OF USER REQUESTS SECTION

//Tries to "login" a user from request data.
router.post('/login', (req, res) => {
    if(req.body.username != null){
        if(req.body.password != null){
            userService.loginUser(req.body.username, req.body.password,(response) => {
                if(response[0].rank === "customer"){
                    res.status(200).sendFile(`${appRoot}/public/customer.html`);
                    userName = response[0].name;
                    userRank = response[0].rank;
                    userEmail = response[0].email;
                    loggedIn = true;
                }
                else if(response[0].rank === "worker"){
                    res.status(200).sendFile(`${appRoot}/public/worker.html`);
                    userName = response[0].name;
                    userRank = response[0].rank;
                    userEmail = response[0].email;
                    loggedIn = true;
                }
                else if(response[0].rank === "manager"){
                    res.status(200).sendFile(`${appRoot}/public/manager.html`);
                    userName = response[0].name;
                    userRank = response[0].rank;
                    userEmail = response[0].email;
                    loggedIn = true;
                }
                else if(response[0].rank == null){
                    res.status(400).sendFile(`${appRoot}/public/index.html`);
                    userName = null;
                    userRank = null;
                    userEmail = null;
                    loggedIn = false;
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
                res.status(200).sendFile(`${appRoot}/public/index.html`);
            },
            (cause) => {
                res.status(400).send(cause);
            }
        )
    });
});

//Logs out the user, and resets the inner variables.
router.get('/logout', (req, res) => {
    userName = null;
    userRank = null;
    userEmail = null;
    loggedIn = false;
    res.status(200).sendFile(`${appRoot}/public/index.html`);
});

//For debug purposes only.
router.get('/listUsers', (req, res) => {
    userService.listUsers((response) => {
        res.status(200).send(response);
    })
});

// END OF USER REQUESTS SECTION
//----------------------------------------------------------------------------------------------------------------------
// START OF ORDER REQUESTS SECTION
// From here, the most important task is to make sure, that the functions are unreachable for unregistered and unauthorised
// users, to keep things somewhat safer IRL too. My method is sure not the right way to do this, but it will definitely work!
// DON'T TRY THIS AT HOME

//Lists all orders with all the information for a customer.
//For all around usage.
router.get('/listMyOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "customer" || userRank === "worker" || userRank === "manager") {
                orderService.readUserOrders(userName, (response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Creates an order from the given data in the request body. It should not be empty or wrong, because the frontend should validate it.
//It is a customer only function.
router.post('/createOrder', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userEmail != null || userEmail != ""){
                if(userRank === "customer") {
                    orderService.getMaxOrderId((maxID) => {
                        orderService.createOrder(
                            {
                                orderID : (maxID+1),
                                customer_name : userName,
                                customer_email : userEmail,
                                window_height : req.body.window_height,
                                window_width : req.body.window_width,
                                shutter_model : req.body.shutter_model,
                                shutter_assembled : false,
                                shutter_installed : false,
                                worker : "",
                                price : ((req.body.window_height * req.body.window_width) * 2),
                                paid : false,
                                manager : ""
                            },
                            () => {
                                res.status(200).sendFile(`${appRoot}/public/customer.html`);
                            },
                            (cause) => {
                                res.status(400).send(cause);
                            }
                        )
                    })
                } else {
                    res.status(400).sendFile(`${appRoot}/public/index.html`);
                }
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Lists all orders from the database.
//For managerial purposes only.
router.get('/listAllOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "manager") {
                orderService.readAllOrders( (response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Lists all the paid orders so far.
//For managerial purposes only.
router.get('/listPaidOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "manager") {
                orderService.readPaidOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Lists all the unpaid orders so far.
//For managerial purposes only.
router.get('/listUnpaidOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "manager") {
                orderService.readUnpaidOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Lists all the assembled orders so far.
//For managers and workers.
router.get('/listAssembledOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "worker" || userRank === "manager") {
                orderService.readAssembledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Lists all the not assembled orders so far.
//For managers and workers.
router.get('/listNotAssembledOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "worker" || userRank === "manager") {
                orderService.readNotAssembledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Lists all the installed orders so far.
//For managers only
router.get('/listInstalledOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "manager") {
                orderService.readInstalledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Lists all the not installed orders so far.
//For managers only.
router.get('/listNotInstalledOrders', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "manager") {
                orderService.readNotInstalledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Updates the paid property of an order, if the customer finished the payment.
//For customers only.
router.post('/payOrder', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "customer") {
                orderService.updatePaidProperty(req.body.orderID, userRank,(response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Updates the assembled property of an order, if the worker finished the assembly proccess.
//For workers only.
router.post('/assembleOrder', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "worker") {
                orderService.updateAssembledProperty(req.body.orderID, userName, userRank,(response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//Updates the installed property of an order, if the manager finished organising it.
//For managers only.
router.post('/installOrder', (req, res) => {
    if(userName != null || userName != ""){
        if(userRank != null || userRank != ""){
            if(userRank === "manager") {
                orderService.updateInstalledProperty(req.body.orderID, userName, userRank,(response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).sendFile(`${appRoot}/public/index.html`);
            }
        } else {
            res.status(400).sendFile(`${appRoot}/public/index.html`);
        }
    } else {
        res.status(400).sendFile(`${appRoot}/public/index.html`);
    }
});

//TODO list parts (ShutterDao + Shutter contoller -> worker -> listParts)
//TODO invoice and statistics part for the managers.
//TODO user data checking for managers (ofc without passwords and all...)

// END OF ORDER REQUESTS SECTION

module.exports = router;