const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/config/logger`);
const mongoConfig = require(`${appRoot}/app/config/mongo`);

const shutterDao = require(`${appRoot}/app/dao/shutterDao`);

/*
Collection structure:
{
    "orderID" : NUMBER,
    "window_height" : NUMBER,
    "window_width" : NUMBER,
    "shutter_model" : NUMBER
}
*/

//Creates a DB query by the given parameters.
//It is an internal function to this module.
function find(parameters, projection, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for element selection)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.elementCollection);

        collection.find(parameters, projection).toArray(function (error, data) {
            assert.strictEqual(error, null);
            logger.info(`${JSON.stringify(data)} data was found in the database.`);
            callback(data);
        });
        client.close();
    });
}

//Inserts one new item into the collection.
function createElement(element, callback) {
    var client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for element insertion)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.elementCollection);

        collection.insertOne(element, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//For cleanup purposes after testings.
function deleteElements(orderID, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to server (for order elements deletion)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.elementCollection);

        collection.deleteMany({orderID: orderID}, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Gives back all of an order elements data by order ID.
function findElementsById(orderID, callback) {
    find({orderID: orderID},
        {
            projection: {
                _id: 0,
                orderID: 1,
                window_height: 1,
                window_width: 1,
                shutter_model: 1
            }
        }, (result) => {
            callback(result);
        });
}

//Gives back all the info for an orders' element by ID.
function readElementsData (orderID, callback) {
    logger.info(`Gathering info for ${orderID} orders' elements list...`);
    let finalResult = [];
    let result = null;
    findElementsById(orderID, (elements) => {
       if(elements === null || elements === undefined){
           logger.info(`Internal error! Can!t find elements for ${orderID} order!`);
           callback(null);
       } else {
           for(let i = 0; i < elements.length(); i++){
               shutterDao.findShutterModel(elements[i].shutter_model, (shutter) => {
                  if(shutter === null || shutter === undefined){
                      logger.info(`Internal error! Can!t find shutter model for ${i} order element!`);
                      callback(null);
                  } else {
                      result = {
                          orderID: elements[i].orderID,
                          window_height: elements[i].window_height,
                          window_width: elements[i].window_width,
                          shutter_model: shutter[0].shutter_model,
                          model_name : shutter[0].model_name,
                          parts : shutter[0].parts,
                          model_base_price : shutter[0].model_base_price,
                          material_modifier : shutter[0].material_modifier,

                      };
                      finalResult.push(result);
                  }
               });
           }
       }
    });
}

module.exports = {
    "createElement": createElement,
    "deleteElements": deleteElements,
    "findElementsById": findElementsById,
    "readElementsData": readElementsData
}