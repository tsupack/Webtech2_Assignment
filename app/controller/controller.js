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
//If user info is valid, then returns the name, the rank and the e-mail properties of the user.
router.post('/login', (req, res) => {
    if (req.body.username != null) {
        if (req.body.password != null) {
            userService.loginUser(req.body.username, req.body.password, (response) => {
                if (response[0] != null || response[0] != undefined) {
                    userName = response[0].name;
                    userRank = response[0].rank;
                    userEmail = response[0].email;
                    loggedIn = true;
                    res.status(200).send(response[0]);
                } else {
                    userName = null;
                    userRank = null;
                    userEmail = null;
                    loggedIn = false;
                    res.status(400).send("User not found!");
                }
            })
        }
    }
});

//Logs out the user, and resets the inner variables.
router.get('/logout', (req, res) => {
    if (!loggedIn) {
        res.status(400).send("No user is logged in!");
    } else {
        userName = null;
        userRank = null;
        userEmail = null;
        loggedIn = false;
        res.status(200).send("Successful user logout!");
    }
});

//Registers a user by the data from the request.
router.post('/register', (req, res) => {
    userService.registerUser(
        {
            userID: 0,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            rank: "customer"
        },
        () => {
            res.status(200).send("Successful customer registration!");
        },
        (cause) => {
            res.status(400).send(cause);
        }
    )
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

//Creates an order from the given data in the request body. It should not be empty or wrong, because the frontend should validate it.
//Base price is set here only by width and height. The price will be modified in the service module by material and model costs later.
//It is a customer only function.
router.post('/createOrder', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userEmail != null || userEmail != "") {
                if (userRank === "customer") {
                    orderService.createOrder(
                        {
                            orderID: 0, //This will get the proper ID in the service module.
                            customer_name: userName,
                            customer_email: userEmail,
                            window_height: req.body.window_height,
                            window_width: req.body.window_width,
                            shutter_model: req.body.shutter_model,
                            shutter_assembled: false,
                            shutter_installed: false,
                            worker: "",
                            price: ((req.body.window_height * req.body.window_width) * 2),
                            paid: false,
                            manager: ""
                        },
                        () => {
                            res.status(200).send("Order creation for customer was successful!");
                        },
                        (cause) => {
                            res.status(400).send(cause);
                        })
                } else {
                    res.status(400).send("Unauthorised user action!");
                }
            } else {
                res.status(400).send("Customer information is missing!");
            }
        } else {
            res.status(400).send("Customer information is missing!");
        }
    } else {
        res.status(400).send("Customer information is missing!");
    }
});

//Lists all orders with all the information for a customer.
router.get('/listMyOrders', (req, res) => {
    if (userName != null || userName != "") {
        orderService.readUserOrders(userName, (response) => {
            res.status(200).send(response);
        })
    } else {
        res.status(400).send("User information is missing!");
    }
});

//Updates the paid property of an order, if the customer finished the payment.
//For customers only.
router.post('/payOrder', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "customer") {
                orderService.updatePaidProperty(req.body.orderID, (response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Customer information is missing!");
        }
    } else {
        res.status(400).send("Customer information is missing!");
    }
});

//Updates the assembled property of an order, if the worker finished the assembly process.
//For workers only.
router.post('/assembleOrder', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "worker") {
                orderService.updateAssembledProperty(req.body.orderID, userName,(response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Worker information is missing!");
        }
    } else {
        res.status(400).send("Worker information is missing!");
    }
});

//Lists all the assembled orders so far.
//For managers and workers.
router.get('/listAssembledOrders', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "worker" || userRank === "manager") {
                orderService.readAssembledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("User information is missing!");
        }
    } else {
        res.status(400).send("User information is missing!");
    }
});

//Lists all the not assembled orders so far.
//For managers and workers.
router.get('/listNotAssembledOrders', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "worker" || userRank === "manager") {
                orderService.readNotAssembledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("User information is missing!");
        }
    } else {
        res.status(400).send("User information is missing!");
    }
});

//Lists all orders from the database.
//For managerial purposes only.
router.get('/listAllOrders', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "manager") {
                orderService.readAllOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Manager information is missing!");
        }
    } else {
        res.status(400).send("Manager information is missing!");
    }
});

//Lists all the paid orders so far.
//For managerial purposes only.
router.get('/listPaidOrders', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "manager") {
                orderService.readPaidOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Manager information is missing!");
        }
    } else {
        res.status(400).send("Manager information is missing!");
    }
});

//Lists all the unpaid orders so far.
//For managerial purposes only.
router.get('/listUnpaidOrders', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "manager") {
                orderService.readUnpaidOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Manager information is missing!");
        }
    } else {
        res.status(400).send("Manager information is missing!");
    }
});

//Lists all the installed orders so far.
//For managers only
router.get('/listInstalledOrders', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "manager") {
                orderService.readInstalledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Manager information is missing!");
        }
    } else {
        res.status(400).send("Manager information is missing!");
    }
});

//Lists all the not installed orders so far.
//For managers only.
router.get('/listNotInstalledOrders', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "manager") {
                orderService.readNotInstalledOrders((response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Manager information is missing!");
        }
    } else {
        res.status(400).send("Manager information is missing!");
    }
});

//Updates the installed property of an order, if the manager finished organising it.
//For managers only.
router.post('/installOrder', (req, res) => {
    if (userName != null || userName != "") {
        if (userRank != null || userRank != "") {
            if (userRank === "manager") {
                orderService.updateInstalledProperty(req.body.orderID, userName, (response) => {
                    res.status(200).send(response);
                })
            } else {
                res.status(400).send("Unauthorised user action!");
            }
        } else {
            res.status(400).send("Manager information is missing!");
        }
    } else {
        res.status(400).send("Manager information is missing!");
    }
});

//TODO list model information, list shutter models
//TODO invoice and statistics part for the managers.
//TODO user data checking for managers (ofc without passwords and all...)
//TODO all the update and delete functions from service modules

// END OF ORDER REQUESTS SECTION

module.exports = router;