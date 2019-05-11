const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/config/logger`);
const mongoConfig = require(`${appRoot}/app/config/mongo`);

/*
Collection structure:
{
      "modelID" : NUMBER,
      "model_name" : STRING,
      "parts" : STRING,
      "model_base_price" : NUMBER,
      "material_modifier" : NUMBER,
 }
*/

//Creates a DB query by the given parameters.
//It is an internal function to this module.
function find(parameters, projection, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for shutter selection)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.shutterCollection);

        collection.find(parameters, projection).toArray(function (error, data) {
            assert.strictEqual(error, null);
            logger.info(`${JSON.stringify(data)} data was found in the database`);
            callback(data);
        });
        client.close();
    });
}

//Inserts one new item into the collection.
function insertShutterModel(shutter, callback){
    var client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error)=>{
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for shutter model insertion)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection= db.collection(mongoConfig.database.shutterCollection);

        collection.insertOne(shutter,function(error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Updates one shutter by given parameters.
//It is an internal function to this module.
function updateShutterModel(modelID, updateSet, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for shutter model property update)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.shutterCollection);

        collection.updateOne({modelID: modelID}, updateSet, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//For cleanup purposes after testings.
function deleteShutterModel(modelID, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to server (for shutter model deletion)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.shutterCollection);

        collection.deleteOne({modelID: modelID}, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Gives back all of a shutter models' data by modelID.
function findShutterModel(modelID, callback) {
    find({modelID: modelID},
        {
            projection: {
                _id: 0,
                modelID : 1,
                model_name : 1,
                parts : 1,
                model_base_price : 1,
                material_modifier : 1,
            }
        }, (result) => {
            callback(result);
        });
}

//Autoincrement function for IDs at data insertion.
function getMaxShutterId(callback){
    find({},
        {
            projection: {
                _id: 0,
                modelID : 1,
            }
        }, (result) => {
            let maxID = null;
            for (let i = 0; i < result.length; i++) {
                if(maxID < result[i].modelID){
                    maxID = result[i].modelID;
                }
            }
            callback(maxID);
        });
}

//Gives back the complete list of shutter models.
function readShutterModels(callback){
    find({},
        {
            projection: {
                _id: 0,
                modelID : 1,
                model_name : 1,
                parts : 1,
                model_base_price : 1,
                material_modifier : 1,
            }
        }, (result) => {
            callback(result);
        });
}

//Updates the price modifier properties of a given shutter model.
function updatePriceProperties(modelID, modelBasePrice, materialModifier, callback) {
    let updateSet = {
        $set: {
            model_base_price: modelBasePrice,
            material_modifier: materialModifier
        }
    };
    updateShutterModel(modelID, updateSet, (result) => {
        callback(result);
    });
}

module.exports = {
    "insertShutterModel" : insertShutterModel,
    "findShutterModel" : findShutterModel,
    "updatePriceProperties": updatePriceProperties,
    "deleteShutterModel" : deleteShutterModel,
    "getMaxShutterId" : getMaxShutterId,
    "readShutterModels" : readShutterModels
};