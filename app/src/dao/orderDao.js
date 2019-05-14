const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/src/config/logger`);
const mongoConfig = require(`${appRoot}/app/src/config/mongo`);

const shutterDao = require(`${appRoot}/app/src/dao/shutterDao`);
const elementDao = require(`${appRoot}/app/src/dao/elementDao`);

/*
Collection structure:
{
      "orderID" : NUMBER,
      "customer_name" : STRING,
      "customer_email" : STRING,
      "shutter_number" : NUMBER,
      "shutters_assembled" : BOOLEAN,
      "shutters_installed" : BOOLEAN,
      "worker" : STRING,
      "price" : NUMBER,
      "paid" : BOOLEAN,
      "manager" : STRING
}
*/

//Flow: payment -> assembly -> installation. If the shutter is installed, then it is finished.

//Creates a DB query by the given parameters.
//It is an internal function to this module.
function find(parameters, projection, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for order selection)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.orderCollection);

        collection.find(parameters, projection).toArray(function (error, data) {
            assert.strictEqual(error, null);
            logger.info(`${JSON.stringify(data)} data was found in the database.`);
            callback(data);
        });
        client.close();
    });
}

//Inserts one new item into the collection.
function createOrder(order, callback) {
    var client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for order creation)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.orderCollection);

        collection.insertOne(order, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Updates one order by given parameters.
//It is an internal function to this module.
function updateOrder(orderID, updateSet, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for order property update)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.orderCollection);

        collection.updateOne({orderID: orderID}, updateSet, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//After inserting the order, and the order elements, it calculates the price for the entire order.
function updatePriceProperty(orderID, callback) {
    logger.info(`Started calculating ${orderID} orders' price...`);
    let price = 0;
    findOrderById(orderID, (order)=> {
        if(order === null || order === undefined){
            logger.info(`Internal error! Can't find ${orderID} order!`);
            callback(false);
        } else {
            elementDao.findElementsById(orderID, (elements) => {
               if(elements === null || elements === undefined){
                   logger.info(`Internal error! Can't find ${orderID} order elements!`);
                   callback(false);
               } else {
                   let counter = 0;
                   for (let i = 0; i < elements.length; i++) {

                       shutterDao.findShutterModel(elements[i].shutter_model, (shutter) => {
                           let calculatedPrice = 0;
                           if(shutter === null || shutter === undefined){
                               logger.info(`Internal error! Can't find shutter model for ${orderID} orders' ${i} element!`);
                               callback(false);
                           } else {
                               calculatedPrice = (((elements[i].window_width * elements[i].window_height) * 2)+ shutter[0].model_base_price + shutter[0].material_modifier);
                               price = price + calculatedPrice
                               logger.info(`Calculated price after ${i} order element is: ${price}`);
                               counter++;
                               if(counter === elements.length){
                                   logger.info(`Final price is: ${price}.`);
                                   let updateSet = {
                                       $set: {
                                           price: price
                                       }
                                   };
                                   logger.info(`Updating ${orderID} orders' price property...`);
                                   updateOrder(orderID, updateSet, () => {
                                   });
                                   callback(true);
                               }
                           }
                       })
                   }
               }
            });
        }
    });
}

//Updates the paid property of an order.
function updatePaidProperty(orderID, callback) {
    let updateSet = {
        $set: {
            paid: true
        }
    };
    updateOrder(orderID, updateSet, (result) => {
        callback(result);
    });
}

//Updates the assembled property of an order and saves the worker name.
function updateAssembledProperty(orderID, workerName, callback) {
    let updateSet = {
        $set: {
            shutters_assembled: true,
            worker: workerName
        }
    };
    updateOrder(orderID, updateSet, (result) => {
        callback(result);
    });
}

//Updates the installed property of an order and saves the manager name.
function updateInstalledProperty(orderID, managerName, callback) {
    let updateSet = {
        $set: {
            shutters_installed: true,
            manager: managerName
        }
    };
    updateOrder(orderID, updateSet, (result) => {
        callback(result);
    });
}

//For cleanup purposes after testings.
function deleteOrder(orderID, callback) {
    elementDao.deleteElements(orderID);
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to server (for order deletion)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.orderCollection);

        collection.deleteOne({orderID: orderID}, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Gives back all of an orders data by username.
function findOrderByName(customerName, callback) {
    find({customer_name: customerName},
        {
            projection: {
                _id: 0,
                orderID: 1,
                customer_name: 1,
                customer_email: 1,
                shutter_number: 1,
                shutters_assembled: 1,
                shutters_installed: 1,
                worker: 1,
                price: 1,
                paid: 1,
                manager: 1
            }
        }, (result) => {
            callback(result);
        });
}

//Gives back all of an orders data by order ID.
function findOrderById(orderID, callback) {
    find({orderID: orderID},
        {
            projection: {
                _id: 0,
                orderID: 1,
                customer_name: 1,
                customer_email: 1,
                shutter_number: 1,
                shutters_assembled: 1,
                shutters_installed: 1,
                worker: 1,
                price: 1,
                paid: 1,
                manager: 1
            }
        }, (result) => {
            callback(result);
        });
}

//Autoincrement function for IDs at data insertion.
function getMaxOrderId(callback) {
    find({},
        {
            projection: {
                _id: 0,
                orderID: 1,
            }
        }, (result) => {
            let maxID = null;
            for (let i = 0; i < result.length; i++) {
                if (maxID < result[i].orderID) {
                    maxID = result[i].orderID;
                }
            }
            callback(maxID);
        });
}

//Gives back the complete list of orders.
function readAllOrders(callback) {
    find({},
        {
            projection: {
                _id: 0,
                orderID: 1,
                customer_name: 1,
                customer_email: 1,
                shutter_number: 1,
                shutters_assembled: 1,
                shutters_installed: 1,
                worker: 1,
                price: 1,
                paid: 1,
                manager: 1
            }
        }, (result) => {
            callback(result);
        });
}

//Gives back the list of paid orders.
function readPaidOrders(callback){
    logger.info("Reading list of paid orders...");
    readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].paid === true){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are already paid.`);
        callback(finalResult);
    });
}

//Gives back the list of unpaid orders.
function readUnpaidOrders(callback){
    logger.info("Reading list of unpaid orders...");
    readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].paid === false){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are not paid yet.`);
        callback(finalResult);
    });
}

//Gives back the list of assembled orders.
function readAssembledOrders(callback){
    logger.info("Reading list of assembled orders...");
    readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutters_assembled === true){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are assembled already.`);
        callback(finalResult);
    });
}

//Gives back the list of not assembled orders.
function readNotAssembledOrders(callback){
    logger.info("Reading list of not assembled orders...");
    readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutters_assembled === false){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are not assembled yet.`);
        callback(finalResult);
    });
}

//Gives back the list of installed (finished) orders.
function readInstalledOrders(callback){
    logger.info("Reading list of installed orders...");
    readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutters_installed === true){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are already installed.`);
        callback(finalResult);
    });
}

//Gives back the list of not installed (finished) orders.
function readNotInstalledOrders(callback){
    logger.info("Reading list of not installed orders...");
    readAllOrders((result) => {
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutters_installed === false){
                finalResult.push(result[i]);
            }
        }
        logger.info(`${JSON.stringify(finalResult)} orders are not installed yet.`);
        callback(finalResult);
    });
}

//Generates base data for statistics.
function readStatistics(callback){
    logger.info("Generating statistics of current state...");
    let paidOrders = 0;
    let unpaidOrders = 0;
    let assembledOrders = 0;
    let notAssembledOrders = 0;
    let installedOrders = 0;
    let notInstalledOrders = 0;
    let income = 0;
    readPaidOrders((result) => {
        paidOrders = result.length;
        logger.info(`${paidOrders} paid orders were found.`);
        for (let i = 0; i < result.length; i++) {
            if(result[i].shutters_installed === true){
                income = income + result[i].price;
            }
        }
        logger.info(`${income} is the total income.`);
        readUnpaidOrders((result) => {
            unpaidOrders = result.length;
            logger.info(`${unpaidOrders} unpaid orders were found.`);
            readAssembledOrders((result) => {
                assembledOrders = result.length;
                logger.info(`${assembledOrders} assembled orders were found.`);
                readNotAssembledOrders((result) => {
                    notAssembledOrders = result.length;
                    logger.info(`${notAssembledOrders} not assembled orders were found.`);
                    readInstalledOrders((result) => {
                        installedOrders = result.length;
                        logger.info(`${installedOrders} installed orders were found.`);
                    });
                    readNotInstalledOrders((result) => {
                        notInstalledOrders = result.length;
                        logger.info(`${notInstalledOrders} not installed orders were found.`);
                        let statistics = {
                            paidOrders: paidOrders,
                            unpaidOrders: unpaidOrders,
                            assembledOrders: assembledOrders,
                            notAssembledOrders: notAssembledOrders,
                            installedOrders: installedOrders,
                            notInstalledOrders: notInstalledOrders,
                            income: income,
                        };
                        logger.info(`Data gathered for statistics is: ${JSON.stringify(statistics)}`);
                        callback(statistics);
                    });
                });
            });
        });
    });







}

//Generates the base of an invoice.
function readInvoiceData(orderID, callback){
    logger.info(`Generating invoice data for ${orderID} order...`);
    findOrderById(orderID, (order) => {
        if(order === null || order === undefined){
            logger.info(`Internal error! Can't find ${orderID} order!`);
            callback(null);
        } else if (order[0].paid === false || order[0].shutters_assembled === false || order[0].shutters_installed === false) {
            logger.info(`Can't generate invoice for ${orderID} order, because it is not finished yet!`);
            callback(null);
        } else {
            let invoiceData = {
                orderID: order[0].orderID,
                customer_name: order[0].customer_name,
                customer_email: order[0].customer_email,
                shutter_number: order[0].shutter_number,
                worker: order[0].worker,
                price: order[0].price,
                paid: order[0].paid,
                manager: order[0].manager
            };
            logger.info(`Data gathered for ${orderID} orders' invoice: ${JSON.stringify(invoiceData)}`);
            callback(invoiceData);
        }
    });
}

module.exports = {
    "createOrder": createOrder,
    "deleteOrder": deleteOrder,

    "findOrderByName": findOrderByName,
    "findOrderById": findOrderById,
    "getMaxOrderId": getMaxOrderId,
    "readAllOrders": readAllOrders,
    "readPaidOrders": readPaidOrders,
    "readUnpaidOrders": readUnpaidOrders,
    "readAssembledOrders": readAssembledOrders,
    "readNotAssembledOrders": readNotAssembledOrders,
    "readInstalledOrders": readInstalledOrders,
    "readNotInstalledOrders": readNotInstalledOrders,

    "readStatistics": readStatistics,
    "readInvoiceData": readInvoiceData,

    "updatePriceProperty": updatePriceProperty,
    "updatePaidProperty": updatePaidProperty,
    "updateAssembledProperty": updateAssembledProperty,
    "updateInstalledProperty": updateInstalledProperty,
};