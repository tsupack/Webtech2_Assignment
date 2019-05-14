const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/src/config/logger`);

function ShutterService(shutterDao){
    if(shutterDao != undefined || shutterDao != null){
        this.shutterDao = shutterDao;
    }
    else {
        this.shutterDao = require(`${appRoot}/app/src/dao/shutterDao`);
    }
}

//Inserts a new item with the given data to the collection.
ShutterService.prototype.createShutterModel = function (shutter, callback) {
    logger.info(`Shutter model insertion has started!`);
    this.shutterDao.getMaxShutterId((maxID) => {
        logger.info(`The found maximum ID was: ${maxID}`);
        shutter.modelID = (maxID + 1);
        this.shutterDao.insertShutterModel(shutter, (response) => {
            logger.info(`"${JSON.stringify(shutter)}" shutter is successfully inserted into the database!`);
            callback(response);
        });
    });
};

//Updates the price modifier properties of a shutter model.
ShutterService.prototype.updateShutterPrice = function(modelID, modelBasePrice, materialModifier, callback){
    logger.info(`Updating ${modelID} shutter model...`);
    this.shutterDao.findShutterModel(modelID, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't find ${modelID} model!`);
            callback(false);
        } else {
            this.shutterDao.updatePriceProperties(modelID, modelBasePrice, materialModifier, (result) => {
                logger.info(`${JSON.stringify(result)}. ${modelID} shutter model is updated successfully!`);
                callback(true);
            });
        }
    });
};

//Searches for the given model id to get the shutter models' data.
ShutterService.prototype.findShutterModel = function (modelID, callback) {
    this.shutterDao.findShutterModel(modelID, (result) => {
        if(result[0] === null || result[0] === undefined) {
            logger.info(`"${modelID}" shutter model was not found!`);
        }
        else {
            logger.info(`"${JSON.stringify(result)}" shutter model was found!`);
        }
        callback(result);
    });
};

//Deletes a shutter model by ID.
ShutterService.prototype.deleteShutterModel = function(modelID, callback){
    logger.info(`Deleting ${modelID} shutter model...`);
    this.shutterDao.deleteShutterModel(modelID, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't find ${modelID} shutter model!`);
            callback(false);
        } else {
            this.shutterDao.deleteShutterModel(modelID, (result) => {
                logger.info(`${JSON.stringify(result)}. ${modelID} shutter model is deleted successfully!`);
                callback(true);
            });
        }
    });
};

//Lists all the available shutter models.
ShutterService.prototype.readShutterModels = function(callback){
    this.shutterDao.readShutterModels((shutters) => {
        callback(shutters);
    });
};

module.exports = ShutterService;