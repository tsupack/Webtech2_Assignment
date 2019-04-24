const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/config/logger`);

function UserService(userDao){
    if(userDao != undefined || userDao != null){
        this.userDao = userDao;
    }
    else {
        this.userDao = require(`${appRoot}/app/dao/userDao`);
    }
}

//Searches for the given username at login to get the users data if available.
UserService.prototype.findUser = function (username, callback) {
    this.userDao.findUser(username, (result) => {
        if(result === undefined || result[0] == null) {
            logger.info(`"${username}" user was not found!`);
        }
        else {
            logger.info(`"${JSON.stringify(result)}" user was found!`);
        }
        callback(result);
    });
};

//Gives back the rank and the name of a user at a successful login, to get the appropriate functions of the page enabled. VERY BASIC, DON'T EVER USE SOMETHING LIKE THIS!
UserService.prototype.loginUser = function  (username, password, callback) {
    logger.info(`User login has started!`);
    this.findUser(username, (user) => {
        let userInfo = [];
        if(user === undefined || user[0] == null) {
            logger.info(`"${username}" user is not registered yet!`);
            callback(userInfo);
        }
        else {
            if(password === user[0].password){
                logger.info(`"${username}" user successfully logged in!`);
                userInfo.push({
                    name : user[0].name,
                    rank : user[0].rank,
                    email : user[0].email
                });
            }
            else {
                logger.info(`Password for "${username}" user is incorrect!`);
            }
            callback(userInfo);
        }
    })
};

//Calls to get the highest ID currently in the collection at new item insertion.
UserService.prototype.getMaxUserId = function (callback) {
    logger.info(`User registration has started!`);
    this.userDao.getMaxUserId((maxID) => {
        logger.info(`The found maximum ID was: ${maxID}`);
        callback(maxID);
    });
}

//Inserts a new item with the given data to the collection.
UserService.prototype.registerUser = function (user, callback) {
    this.userDao.registerUser(user, (response) => {
        logger.info(`"${JSON.stringify(user)}" user is successfully inserted into the database!`);
        callback(response);
    });
};

//For debug purposes only.
UserService.prototype.listUsers = function(callback){
    this.userDao.readUsers((users) => {
        /*let ID1 = 6;
        let ID2 = 7;
        this.userDao.deleteUser(ID1, (result) => {
            logger.info(`User with ${ID1} ID was deleted! ${JSON.stringify(result)}`);
        });
        this.userDao.deleteUser(ID2, (result) => {
            logger.info(`User with ${ID2} ID was deleted! ${JSON.stringify(result)}`);
        });*/
        callback(users);
    });
};

module.exports = UserService;