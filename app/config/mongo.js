const mongoConfig = {
    database: {
        url: 'mongodb://localhost:27017',
        databaseName: 'shutterDB',
        userCollection: 'users',
        orderCollection: 'orders',
        shutterCollection: 'shutters'
    },
    config: {
        useNewUrlParser: true
    }

};

module.exports = mongoConfig;