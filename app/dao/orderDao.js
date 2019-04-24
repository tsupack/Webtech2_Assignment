const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/config/logger`);
const mongoConfig = require(`${appRoot}/app/config/mongo`);;

/*
Collection structure:
{
      "orderID" : NUMBER,
      "customer_name" : STRING,
      "customer_email" : STRING,
      "window_height" : NUMBER,
      "window_width" : NUMBER,
      "shutter_model" : NUMBER,
      "shutter_assembled" : BOOLEAN,
      "shutter_installed" : BOOLEAN,
      "worker" : STRING,
      "price" : NUMBER,
      "paid" : BOOLEAN,
      "manager" : STRING
}
*/

//Creates a DB query by the given parameters. It is an internal function to this module.
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
function createOrder(order, callback){
    var client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error)=>{
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for order creation)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection= db.collection(mongoConfig.database.orderCollection);

        collection.insertOne(order,function(error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Updates one order by given parameter.
function updateOrder(orderID, updateSet, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        //console.log("Connected successfully to server");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.orderCollection);

        collection.updateOne({orderID: orderID}, updateSet, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//For cleanup purposes after testings.
function deleteOrder(orderID, callback) {
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
                orderID : 1,
                customer_name : 1,
                customer_email : 1,
                window_height : 1,
                window_width : 1,
                shutter_model : 1,
                shutter_assembled : 1,
                shutter_installed : 1,
                worker : 1,
                price : 1,
                paid : 1,
                manager : 1
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
                orderID : 1,
                customer_name : 1,
                customer_email : 1,
                window_height : 1,
                window_width : 1,
                shutter_model : 1,
                shutter_assembled : 1,
                shutter_installed : 1,
                worker : 1,
                price : 1,
                paid : 1,
                manager : 1
            }
        }, (result) => {
            callback(result);
        });
}

//Autoincrement function for IDs at data insertion.
function getMaxOrderId(callback){
    find({},
        {
            projection: {
                _id: 0,
                orderID : 1,
            }
        }, (result) => {
            let maxID = null;
            for (let i = 0; i < result.length; i++) {
                if(maxID < result[i].orderID){
                    maxID = result[i].orderID;
                }
            }
            callback(maxID);
        });
}

//Gives back the complete list of orders.
function readAllOrders(callback){
    find({},
        {
            projection: {
                _id: 0,
                orderID : 1,
                customer_name : 1,
                customer_email : 1,
                window_height : 1,
                window_width : 1,
                shutter_model : 1,
                shutter_assembled : 1,
                shutter_installed : 1,
                worker : 1,
                price : 1,
                paid : 1,
                manager : 1
            }
        }, (result) => {
        callback(result);
    });
}

module.exports = {
    "createOrder" : createOrder,
    "deleteOrder" : deleteOrder,
    "updateOrder" : updateOrder,

    "findOrderByName" : findOrderByName,
    "findOrderById" : findOrderById,
    "getMaxOrderId" : getMaxOrderId,

    "readAllOrders" : readAllOrders
};