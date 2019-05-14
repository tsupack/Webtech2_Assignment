const mongoConfig = {
    database: {
        url: 'mongodb://localhost:27017',
        //url: 'mongodb://172.21.0.10:27017',
        databaseName: 'shutterDB',
        userCollection: 'users',
        shutterCollection: 'shutters',
        orderCollection: 'orders',
        elementCollection: 'elements'
    },
    config: {
        useNewUrlParser: true
    }

};

module.exports = mongoConfig;