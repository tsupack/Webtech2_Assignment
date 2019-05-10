const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/config/logger`);

function OrderService(orderDao){
    if(orderDao != undefined || orderDao != null){
        this.orderDao = orderDao;
    }
    else {
        this.orderDao = require(`${appRoot}/app/dao/orderDao`);
    }
}

//Inserts a new item with the given data to the collection.
OrderService.prototype.createOrder = function (order, callback) {
    logger.info(`Order creation has started!`);
    this.orderDao.getMaxOrderId((maxID) => {
        logger.info(`The found maximum ID was: ${maxID}`);
        order.orderID = (maxID + 1);
    });
    this.orderDao.createOrder(order, (response) => {
        logger.info(`"${JSON.stringify(order)}" order is successfully inserted into the database!`);
        callback(response);
    });
};

//Gives back all the orders in the collection. Mostly for managerial purproses.
OrderService.prototype.readAllOrders = function(callback){
    this.orderDao.readAllOrders((orders) => {
        callback(orders);
    });
};

//Calls to get the highest ID currently in the collection at new item insertion.
OrderService.prototype.readUserOrders = function (userName, callback) {
    this.orderDao.findOrderByName( userName,(orders) => {
        logger.info(`"${JSON.stringify(orders)}" orders were found in the database for ${userName}!`);
        callback(orders);
    });
};

//Gives back all the assembled orders.
OrderService.prototype.readAssembledOrders = function(callback){
    this.orderDao.readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutter_assembled === true){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are assembled already.`);
        callback(finalResult);
    });
};

//Gives back all the not assembled orders.
OrderService.prototype.readNotAssembledOrders = function(callback){
    this.orderDao.readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutter_assembled === false){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are not assembled yet.`);
        callback(finalResult);
    });
};

//Gives back all the installed orders.
OrderService.prototype.readInstalledOrders = function(callback){
    this.orderDao.readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutter_installed === true){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are already installed.`);
        callback(finalResult);
    });
};

//Gives back all the not installed orders.
OrderService.prototype.readNotInstalledOrders = function(callback){
    this.orderDao.readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutter_installed === false){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are not installed yet.`);
        callback(finalResult);
    });
};

//Gives back all the paid orders.
OrderService.prototype.readPaidOrders = function(callback){
    this.orderDao.readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].paid === true){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are already paid.`);
        callback(finalResult);
    });
};

//Gives back all the unpaid orders.
OrderService.prototype.readUnpaidOrders = function(callback){
    this.orderDao.readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].paid === false){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are not paid yet.`);
        callback(finalResult);
    });
};

//Updates an orders' paid property, if a customer finishes payment.
//This action requires the user to be on a customer rank to commit.
OrderService.prototype.updatePaidProperty = function(orderID, rank, callback){
    logger.info(`Updating paid property of ${orderID} order...`);
    if(rank != "customer" || rank === null || rank === undefined){
        logger.info(`Unauthorised payment action...`);
        callback(false);
    } else {
        this.orderDao.updatePaidProperty(orderID, (result) => {
            logger.info(`${JSON.stringify(result)}. ${orderID} orders' paid property is updated successfully!`);
            callback(true);
        });
    }
};

//Updates an orders' assembled property and assigns the worker, if the worker finished working on it.
//If the order is not paid yet, then it will return null.
//This action requires the user to be on a worker rank to commit.
OrderService.prototype.updateAssembledProperty = function(orderID, workerName, rank, callback){
    logger.info(`Updating assembled property of ${orderID} order...`);
    if(rank != "worker" || rank === null || rank === undefined){
        logger.info(`Unauthorised assembling action...`);
        callback(false);
    } else {
        this.orderDao.findOrderById(orderID, (result) => {
            if(result[0].paid === false) {
                logger.info(`${orderID} order is not paid yet, so it can't be assembled!`);
                callback(false);
            }
            else if(result[0].paid === true) {
                this.orderDao.updateAssembledProperty(orderID, workerName, (order) => {
                    logger.info(`${JSON.stringify(order)}. ${orderID} orders' assembled property is updated successfully!`);
                    callback(true);
                });
            }
            else if(result[0].paid === null || result[0].paid === undefined){
                logger.info(`Internal error! Can't read property "paid" for assembly update!`);
                callback(false);
            }
        });
    }
};

//Updates an orders' installed property and assigns the manager, if the manager finished working on it.
//If the order is not assembled (or paid) yet, then it will return null.
//This action requires the user to be on a manager rank to commit.
OrderService.prototype.updateInstalledProperty = function(orderID, managerName, rank, callback){
    logger.info(`Updating installed property of ${orderID} order...`);
    if(rank != "manager" || rank === null || rank === undefined){
        logger.info(`Unauthorised installment action...`);
        callback(false);
    } else {
        this.orderDao.findOrderById(orderID, (result) => {
            if(result[0].shutter_assembled === false) {
                logger.info(`${orderID} order is not paid or not assembled yet, so it can't be installed!`);
                callback(false);
            }
            else if(result[0].shutter_assembled === true) {
                this.orderDao.updateInstalledProperty(orderID, managerName, (order) => {
                    logger.info(`${JSON.stringify(order)}. ${orderID} orders' installed property is updated successfully!`);
                    callback(true);
                });
            }
            else if(result[0].shutter_assembled === null || result[0].shutter_assembled === undefined){
                logger.info(`Internal error! Can't read property "assembled" for installed update!`);
                callback(false);
            }
        });
    }
};

OrderService.prototype.listStatistics = function (rank, callback){
    //TODO implement the dao side for this if needed. This should give back numbers of : paid, unpaid, assembled, not assambled,
    //TODO installed, not installed orders, and summary of income (Consider an installed order finished)
};

OrderService.prototype.createInvoice = function (orderID, rank, callback){
    //TODO Should gather all the information of an order: the customer, the worker, the manager, the window parameters
    //TODO the shutter model details, the price and lastly some sort of date.
};


module.exports = OrderService;