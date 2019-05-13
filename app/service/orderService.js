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
        this.orderDao.createOrder(order, (response) => {
            logger.info(`"${JSON.stringify(order)}" order is successfully inserted into the database!`);
            callback(response);
        });
    });
};

OrderService.prototype.setPrice = function(orderID, callback){
    this.orderDao.updatePriceProperty(orderID, (result) => {
        if(result){
            logger.info(`${orderID} orders' price property was updated successfully!`);
            callback(true);
        } else {
            logger.info(`${orderID} orders' price property is not updated! There is no elements, or wrong shutter model!`);
            callback(false);
        }
    });
};

//Updates an orders' paid property, if a customer finishes payment.
//This action requires the user to be on a customer rank to commit.
OrderService.prototype.updatePaidProperty = function(orderID, callback){
    logger.info(`Updating paid property of ${orderID} order...`);
    this.orderDao.findOrderById(orderID, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't read property "paid" for payment update!`);
            callback(false);
        } else {
            this.orderDao.updatePaidProperty(orderID, (result) => {
                logger.info(`${JSON.stringify(result)}. ${orderID} orders' paid property is updated successfully!`);
                callback(true);
            });
        }
    });
};

//Updates an orders' assembled property and assigns the worker, if the worker finished working on it.
//If the order is not paid yet, then it will return false.
//This action requires the user to be on a worker rank to commit.
OrderService.prototype.updateAssembledProperty = function(orderID, workerName, callback){
    logger.info(`Updating assembled property of ${orderID} order...`);
    this.orderDao.findOrderById(orderID, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't read property "paid" for assembly update!`);
            callback(false);
        } else if(result[0].paid === false) {
            logger.info(`${orderID} order is not paid yet, so it can't be assembled!`);
            callback(false);
        } else if(result[0].paid === true) {
            this.orderDao.updateAssembledProperty(orderID, workerName, (order) => {
                logger.info(`${JSON.stringify(order)}. ${orderID} orders' assembled property is updated successfully!`);
                callback(true);
            });
        }
    });
};

//Updates an orders' installed property and assigns the manager, if the manager finished working on it.
//If the order is not assembled (or paid) yet, then it will return false.
//This action requires the user to be on a manager rank to commit.
OrderService.prototype.updateInstalledProperty = function(orderID, managerName, callback){
    logger.info(`Updating installed property of ${orderID} order...`);
    this.orderDao.findOrderById(orderID, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't read property "assembled" for installed update!`);
            callback(false);
        } else if(result[0].shutters_assembled === false) {
            logger.info(`${orderID} order is not paid or not assembled yet, so it can't be installed!`);
            callback(false);
        } else if(result[0].shutters_assembled === true) {
            this.orderDao.updateInstalledProperty(orderID, managerName, (order) => {
                logger.info(`${JSON.stringify(order)}. ${orderID} orders' installed property is updated successfully!`);
                callback(true);
            });
        }
    });
};

//Deletes an order by ID.
OrderService.prototype.deleteOrder = function(orderID, callback){
    logger.info(`Deleting ${orderID} order...`);
    this.orderDao.findOrderById(orderID, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't find ${orderID} order!`);
            callback(false);
        } else {
            this.orderDao.deleteOrder(orderID, (result) => {
                logger.info(`${JSON.stringify(result)}. ${orderID} order is deleted successfully!`);
                callback(true);
            });
        }
    });
};

//Gives back all the orders in the collection. Mostly for managerial purposes.
OrderService.prototype.readAllOrders = function(callback){
    this.orderDao.readAllOrders((orders) => {
        callback(orders);
    });
};

//Calls to get all the orders of a user by name.
OrderService.prototype.readUserOrders = function (username, callback) {
    this.orderDao.findOrderByName( username,(orders) => {
        if(orders[0] === null || orders[0] === undefined) {
            logger.info(`Internal error! Can't find any orders for ${username}!`);
            callback(null);
        } else {
            logger.info(`"${JSON.stringify(orders)}" orders were found in the database for ${username}!`);
            callback(orders);
        }
    });
};

//Gives back all the paid orders.
OrderService.prototype.readPaidOrders = function(callback){
    this.orderDao.readPaidOrders((result) => {
        callback(result);
    });
};

//Gives back all the unpaid orders.
OrderService.prototype.readUnpaidOrders = function(callback){
    this.orderDao.readUnpaidOrders((result) => {
        callback(result);
    });
};

//Gives back all the assembled orders.
OrderService.prototype.readAssembledOrders = function(callback){
    this.orderDao.readAssembledOrders((result) => {
        callback(result);
    });
};

//Gives back all the not assembled orders.
OrderService.prototype.readNotAssembledOrders = function(callback){
    this.orderDao.readNotAssembledOrders((result) => {
        callback(result);
    });
};

//Gives back all the installed orders.
OrderService.prototype.readInstalledOrders = function(callback){
    this.orderDao.readInstalledOrders((result) => {
        callback(result);
    });
};

//Gives back all the not installed orders.
OrderService.prototype.readNotInstalledOrders = function(callback){
    this.orderDao.readNotInstalledOrders((result) => {
        callback(result);
    });
};

//Reads statistic information from the database.
//This action requires the user to be on a manager rank to commit.
OrderService.prototype.readStatistics = function (callback){
    this.orderDao.readStatistics((result) => {
        callback(result);
    });
};

//Reads the base information of an invoice.
OrderService.prototype.readInvoiceData = function (orderID, callback){
    this.orderDao.readInvoiceData(orderID, (result) => {
        callback(result);
    })
};


module.exports = OrderService;