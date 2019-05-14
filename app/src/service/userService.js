const appRoot = require('app-root-path');
const logger = require(`${appRoot}/app/src/config/logger`);

function UserService(userDao){
    if(userDao != undefined || userDao != null){
        this.userDao = userDao;
    }
    else {
        this.userDao = require(`${appRoot}/app/src/dao/userDao`);
    }
}

//Searches for the given username at login to get the users data if available.
UserService.prototype.findUser = function (username, callback) {
    this.userDao.findUser(username, (result) => {
        if(result[0] === undefined || result[0] === null) {
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
        if(user[0] === undefined || user[0] === null) {
            logger.info(`"${username}" user is not registered yet!`);
            callback(null);
        }
        else {
            if(password === user[0].password){
                logger.info(`"${username}" user successfully logged in!`);
                let userInfo = {
                    name: user[0].name,
                    rank: user[0].rank,
                    email: user[0].email
                };
                callback(userInfo);
            }
            else {
                logger.info(`Password for "${username}" user is incorrect!`);
                callback(null);
            }
        }
    })
};

//Inserts a new item with the given data to the collection.
UserService.prototype.registerUser = function (user, callback) {
    logger.info(`User registration has started!`);
    this.userDao.getMaxUserId((maxID) => {
        logger.info(`The found maximum ID was: ${maxID}`);
        user.userID = (maxID + 1);
        this.userDao.registerUser(user, (response) => {
            logger.info(`"${JSON.stringify(user)}" user is successfully inserted into the database!`);
            callback(response);
        });
    });
};

//Updates a users' e-mail address by username.
UserService.prototype.updateUserEmail = function(username, email, callback){
    logger.info(`Updating ${username} user...`);
    this.userDao.findUser(username, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't find ${username} user!`);
            callback(false);
        } else {
            this.userDao.updateEmailProperty(result[0].userID, email,(result) => {
                logger.info(`${JSON.stringify(result)}. ${username} users' e-mail is updated successfully!`);
                callback(true);
            });
        }
    });
};

//Deletes a user by username.
UserService.prototype.deleteUser = function(username, callback){
    logger.info(`Deleting ${username} user...`);
    this.userDao.findUser(username, (result) => {
        if(result[0] === null || result[0] === undefined){
            logger.info(`Internal error! Can't find ${username} user!`);
            callback(false);
        } else {
            this.userDao.deleteUser(result[0].userID, (result) => {
                logger.info(`${JSON.stringify(result)}. ${username} user is deleted successfully!`);
                callback(true);
            });
        }
    });
};

//For debug purposes only.
UserService.prototype.listUsers = function(callback){
    this.userDao.readUsers((users) => {
        callback(users);
    });
};

module.exports = UserService;