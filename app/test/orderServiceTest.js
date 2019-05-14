const assert = require('assert');
const sinon = require('sinon');
const mocha = require('mocha');
logger = require('../src/config/logger');
logger.transports.forEach((t) => (t.silent = true)); //silences logging

const orderService = require('../src/service/orderService.js');
const dao = {
    createOrder: function (order, callback) {
        callback(order)
    },
    deleteOrder: function (orderID, callback) {
        callback(orderID)
    },
    findOrderByName: function (customerName, callback) {
        callback(customerName)
    },
    getMaxOrderId: function (callback){
        callback()
    },
    readAllOrders (callback) {
        callback()
    }
};

const daoMock = sinon.mock(dao);
const service = new orderService(dao);
mocha.describe('Order Service Test', function () {
    it('createOrder is called once and verifies if the callback value is correct', function () {
        daoMock.expects('getMaxOrderId').once();
        service.createOrder({model: 'model'}, (result) => {
            assert.strictEqual(result, {model: 'model'});
        });
        assert(daoMock.verify());
    });

    it('list user orders from DB, which called once and correct', function () {
        daoMock.expects('findOrderByName').once();
        service.readUserOrders("lali", (result) => {
            assert.strictEqual(result, "lali");
        });
        assert(daoMock.verify());
    });

    it('list no orders from DB', function () {
        let service = new orderService();
        service.readUserOrders("lali", (result) => {
            assert.notStrictEqual(result, []);
        });
    });

    it('readAllOrders is called once', function () {
        let service = new orderService();
        let spy = sinon.spy(service, 'readAllOrders');
        service.readAllOrders(() => {
        });
        assert.strictEqual(spy.called, true);
    });

    it('readPaidOrders is called once', function () {
        let service = new orderService();
        let spy = sinon.spy(service, 'readPaidOrders');
        service.readPaidOrders(() => {
        });
        assert.strictEqual(spy.called, true);
    });
});