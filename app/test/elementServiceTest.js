const assert = require('assert');
const sinon = require('sinon');
const mocha = require('mocha');
logger = require('../src/config/logger');
logger.transports.forEach((t) => (t.silent = true)); //silences logging

const elementService = require('../src/service/elementService.js');
const dao = {
    createElement: function (element, callback) {
        callback(element)
    },
    findElementsById: function (orderID, callback) {
        callback(orderID)
    },
    getMaxUserId: function (callback){
        callback()
    }
};

const daoMock = sinon.mock(dao);
const service = new elementService(dao);
mocha.describe('Element Service Test', function () {
    it('createElement is called once and verifies if the callback value is correct', function () {
        daoMock.expects('createElement').once();
        service.createElement({model: 'model'}, (result) => {
            assert.strictEqual(result, {model: 'model'});
        });
        assert(daoMock.verify());
    });

    it('list one orders element list from DB, which called once and correct', function () {
        daoMock.expects('findElementsById').once();
        service.findElementsById(1, (result) => {
            assert.strictEqual(result, 1);
        });
        assert(daoMock.verify());
    });

    it('list no elements from DB', function () {
        let service = new elementService();
        service.findElementsById(1, (result) => {
            assert.notStrictEqual(result, []);
        });
    });

    it('readElementsData is called once', function () {
        let service = new elementService();
        let spy = sinon.spy(service, 'readElementsData');
        service.readElementsData(1,() => {
        });
        assert.strictEqual(spy.called, true);
    });

    it('findElementsById is called once', function () {
        let service = new elementService();
        let spy = sinon.spy(service, 'findElementsById');
        service.findElementsById(1,() => {
        });
        assert.strictEqual(spy.called, true);
    });
});