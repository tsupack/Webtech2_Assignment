const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/config/logger`);
const mongoConfig = require(`${appRoot}/app/config/mongo`);

/*
Collection structure:
{
      "userID" : NUMBER,
      "name" : STRING,
      "email" : STRING,
      "username" : STRING,
      "password" : STRING,
      "rank" : STRING
 }
*/

//Creates a DB query by the given parameters.
//It is an internal function to this module.
function find(parameters, projection, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for user selection)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.userCollection);

        collection.find(parameters, projection).toArray(function (error, data) {
            assert.strictEqual(error, null);
            logger.info(`${JSON.stringify(data)} data was found in the database`);
            callback(data);
        });
        client.close();
    });
}

//Inserts one new item into the collection.
function registerUser(user, callback){
    var client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error)=>{
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for user registration)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection= db.collection(mongoConfig.database.userCollection);

        collection.insertOne(user,function(error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Updates one user by given parameters.
//It is an internal function to this module.
function updateUser(userID, updateSet, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to database (for user property update)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.userCollection);

        collection.updateOne({userID: userID}, updateSet, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//For cleanup purposes after testings.
function deleteUser(userID, callback) {
    let client = new MongoClient(mongoConfig.database.url, mongoConfig.config);
    client.connect((error) => {
        assert.strictEqual(null, error);
        logger.info("Connected successfully to server (for user deletion)!");

        const db = client.db(mongoConfig.database.databaseName);
        const collection = db.collection(mongoConfig.database.userCollection);

        collection.deleteOne({userID: userID}, function (error, data) {
            assert.strictEqual(error, null);
            callback(data);
        });
        client.close();
    });
}

//Gives back all of a users data by username.
function findUser(username, callback) {
    find({username: username},
        {
            projection: {
                _id: 0,
                userID : 1,
                name : 1,
                email : 1,
                username : 1,
                password : 1,
                rank : 1
            }
        }, (result) => {
            callback(result);
    });
}

//Autoincrement function for IDs at data insertion.
function getMaxUserId(callback){
    find({},
        {
            projection: {
                _id: 0,
                userID : 1,
            }
        }, (result) => {
        let maxID = null;
        for (let i = 0; i < result.length; i++) {
            if(maxID < result[i].userID){
                maxID = result[i].userID;
            }
        }
        callback(maxID);
    });
}

//Gives back the complete list of users. Only for debug purposes.
function readUsers(callback){
    find({},
        {
            projection: {
                _id: 0,
                userID : 1,
                name : 1,
                email : 1,
                username : 1,
                password : 0,
                rank : 1
            }
        }, (result) => {
            callback(result);
    });
}

//Updates the e-mail property of a given user.
function updateEmailProperty(userID, email, callback) {
    let updateSet = {
        $set: {
            email: email
        }
    };
    updateUser(userID, updateSet, (result) => {
        callback(result);
    });
}

module.exports = {
    "registerUser" : registerUser,
    "deleteUser" : deleteUser,
    "updateEmailProperty": updateEmailProperty,
    "findUser" : findUser,
    "getMaxUserId" : getMaxUserId,
    "readUsers" : readUsers
};