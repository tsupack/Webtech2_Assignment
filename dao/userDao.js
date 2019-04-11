/*MongoDB related code */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//Connection URL
const url = 'mongodb://localhost:27017';

//Database Name
const dbName = 'shutterDB';
const collectionName = 'users';
/*MongoDB related code ends*/

function find(findParams, callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);
        //console.log.info("Connected successfully to database (for user selection)!");

        const db = client.db(dbName);
        const collection= db.collection(collectionName);

        collection.find(findParams).toArray(function(err, docs) {
            assert.equal(err, null);
            callback(docs);
        });
        client.close();
    });
}

function findUser(username, callback) {
    find(username,(result) => {callback(result)});
}

function readUsers(callback){
    find({}, (result) => {callback(result)});
}

function registerUser(user, callback){
    var client = new MongoClient(url);
    client.connect((err)=>{
        assert.equal(null, err);
        //console.log.info("Connected successfully to database (for user registration)!");

        const db = client.db(dbName);
        const collection= db.collection(collectionName);

        collection.insertOne(user,function(err, docs) {
            assert.equal(err, null);
            callback(docs);
        });
        client.close();
    });
}

module.exports = {
    "readUsers" : readUsers,
    "registerUser" : registerUser,
    "findUser" : findUser
};