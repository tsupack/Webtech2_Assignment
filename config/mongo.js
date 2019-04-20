const mongoConfig = {
    database: {
        url: 'mongodb://localhost:27017',
        databaseName: 'shutterDB',
        userCollection: 'users',
        orderCollection: 'orders'
    },
    config: {
        useNewUrlParser: true
    }

};

module.exports = mongoConfig;