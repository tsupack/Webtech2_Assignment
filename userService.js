function UserService(userDao){
    const logger = require('./config/logger');
    const md5 = require('md5.js');
    if(userDao != undefined && userDao != null){
        this.userDao = userDao;
    }
    else {
        this.userDao = require('./dao/userDao');
    }
}

function findUser (username, callback) {
    this.userDao.findUser(username, (response) => {
        if(username != response['user']['username'] || response == null){
            this.logger.info(`${username} was not found!`);
        }
        else {
            this.logger.info(`${JSON.stringify(response)} was found!`);
        }
        callback(response);
    });
};

UserService.prototype.loginUser = function  (username, password, callback) {
    findUser(username, (response) => {
        if(password === response['user']['password']){
            this.logger.info(`${username} successfully logged in!`);
            var userRank = response['user']['rank'];
        }
        else {
            this.logger.info(`Password for ${username} is incorrect!`);
            var userRank = null;
        }
        callback(userRank);
    })
};

UserService.prototype.listUsers = function(callback){
    this.userDao.readUsers((users) => {
        this.logger.info(`${users.length} users were found!`);
        this.logger.info(`${users.toString()} was found!`);
        callback(users);
    })
};

UserService.prototype.registerUser = function (user, callback) {
    this.userDao.registerUser(user, (response) => {
        this.logger.info(`${JSON.stringify(user)} inserted!`);
        callback(response);
    });
};

module.exports = UserService;