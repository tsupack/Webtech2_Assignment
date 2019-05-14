const assert = require('assert');
const sinon = require('sinon');
const mocha = require('mocha');
logger = require('../src/config/logger');
logger.transports.forEach((t) => (t.silent = true)); //silences logging

const shutterService = require('../src/service/shutterService.js');
const dao = {
    deleteShutterModel: function (modelID, callback) {
        callback(modelID)
    },
    findShutterModel: function (modelID, callback) {
        callback(modelID)
    },
    getMaxShutterId: function (callback) {
        callback()
    }
};

const daoMock = sinon.mock(dao);
const service = new shutterService(dao);
mocha.describe('Shutter Service Test', function () {
    it('createShutterModel is called once and verifies if the callback value is correct', function () {
        daoMock.expects('getMaxShutterId').once();
        service.createShutterModel({model: 'model'}, (result) => {
            assert.strictEqual(result, {model: 'model'});
        });
        assert(daoMock.verify());
    });

    it('list one shutter model from DB, which called once and correct', function () {
        daoMock.expects('findShutterModel').once();
        service.findShutterModel(1, (result) => {
            assert.strictEqual(result, 1);
        });
        assert(daoMock.verify());
    });

    it('delete one shutter model from DB, which called once and correct', function () {
        daoMock.expects('deleteShutterModel').once();
        service.deleteShutterModel(1, (result) => {
            assert.strictEqual(result, 1);
        });
        assert(daoMock.verify());
    });

    it('list no shutter models from DB', function () {
        let service = new shutterService();
        service.findShutterModel(1, (result) => {
            assert.notStrictEqual(result, []);
        });
    });

    it('readShutterModels is called once', function () {
        let service = new shutterService();
        let spy = sinon.spy(service, 'readShutterModels');
        service.readShutterModels(() => {
        });
        assert.strictEqual(spy.called, true);
    });
});