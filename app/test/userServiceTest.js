const assert = require('assert');
const sinon = require('sinon');
const mocha = require('mocha');
logger = require('../src/config/logger');
logger.transports.forEach((t) => (t.silent = true)); //silences logging

const userService = require('../src/service/userService.js');
const dao = {
    registerUser: function (user, callback) {
        callback(user)
    },
    deleteUser: function (userID, callback) {
        callback(userID)
    },
    findUser: function (username, callback) {
        callback(username)
    },
    getMaxUserId: function (callback){
        callback()
    }
};

const daoMock = sinon.mock(dao);
const service = new userService(dao);
mocha.describe('User Service Test', function () {
    it('registerUser is called once and verifies if the callback value is correct', function () {
        daoMock.expects('getMaxUserId').once();
        service.registerUser({model: 'model'}, (result) => {
            assert.strictEqual(result, {model: 'model'});
        });
        assert(daoMock.verify());
    });

    it('list one user from DB, which called once and correct', function () {
        daoMock.expects('findUser').once();
        service.findUser("lali", (result) => {
            assert.strictEqual(result, "lali");
        });
        assert(daoMock.verify());
    });

    it('delete one user from DB, which called once and correct', function () {
        daoMock.expects('deleteUser').once();
        service.deleteUser("lali", (result) => {
            assert.strictEqual(result, true);
        });
        assert(daoMock.verify());
    });

    it('list no users from DB', function () {
        let service = new userService();
        service.findUser(1, (result) => {
            assert.notStrictEqual(result, []);
        });
    });

    it('listUsers is called once', function () {
        let service = new userService();
        let spy = sinon.spy(service, 'listUsers');
        service.listUsers(() => {
        });
        assert.strictEqual(spy.called, true);
    });
});