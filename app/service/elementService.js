const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/config/logger`);

function ElementService(elementDao){
    if(elementDao != undefined || elementDao != null){
        this.elementDao = elementDao;
    }
    else {
        this.elementDao = require(`${appRoot}/app/dao/elementDao`);
    }
}

//Inserts a new item with the given data to the collection.
ElementService.prototype.createElement = function (element, callback) {
    logger.info(`Element creation has started!`);
    this.elementDao.createElement(element, (response) => {
        logger.info(`"${JSON.stringify(element)}" element is successfully inserted into the database!`);
        callback(response);
    });
};

//Calls to get all the elements of an order by ID.
ElementService.prototype.findElementsById = function (orderID, callback) {
    this.elementDao.findElementsById(orderID, (elements) => {
        logger.info(`"${JSON.stringify(elements)}" elements were found in the database for ${orderID} order!`);
        callback(elements);
    });
};

//Calls to get all the information of an orders' elements by ID.
ElementService.prototype.readElementsData = function (orderID, callback) {
    this.elementDao.readElementsData(orderID, (elements) => {
        logger.info(`"${JSON.stringify(elements)}" info was gathered for ${orderID} order!`);
        callback(elements);
    });
};

module.exports = ElementService;