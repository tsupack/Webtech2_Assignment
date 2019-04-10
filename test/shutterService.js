const assert = require('assert');
const sinon = require('sinon');

/*const service = require('../studentRequestService');

describe('Student Request Service Test',function(){
    it('list request from DB',function(){
        var s = new service();
        s.listRequests((requests) => console.log(requests))
    })
    it('list requests from Own Object',function(){
        var dao = {
            readRequests : function(callback){
                callback({a:'a',b:'b'})
            }
        }
        var s = new service(dao);
        s.listRequests((requests) => {
            console.log('requests')
            console.log(requests)})
    })
    it('list requests test Mocked API called once', function(){
        var dao  = { readRequests : function(callback){}};
        var spy = sinon.spy()
        var daoMock = sinon.mock(dao);
        daoMock.expects('readRequests').once()
        var s = new service(dao);
        s.listRequests((requests) =>{});

        assert(daoMock.verify())

    })
})*/