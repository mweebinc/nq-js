const Queue = require('../src/Queue');
const RestController = require('../src/controllers/RestController')
const getRestController = require('../src/controllers/index');
const UserCache = require('../src/data/user/source/UserCache')
const getXhrAdapter  = require('../src/adapters/rest/xhr/index')
const GetMemoryAdapter = require("../src/adapters/cache/memory");
const appId = '6560588f36297abd70cb7433774d5e09';
const masterKey = '43600a5f650ed69e3391ccdf271332d437f4026e';



xdescribe('http  rest adapter', () =>{

    //initialize values
    Queue.setUrl('http://localhost/v1');
    Queue.setMasterKey(masterKey);
    Queue.setApplicationId(appId);

    //with spy
    xit('should execute GET request', function(done){
        const document = {
            id: 'RJO6BD61U9',
            name: 'Mug',
            price: 100000,
            acl: { read: [ '*' ], write: [] },
            createdAt: '2022-06-04T09:54:53.448Z',
            updatedAt: '2022-06-07T13:42:53.029Z'
        }
        const adapter = {
            request : jasmine.createSpy().and.returnValue(Promise.resolve(document))
        }
        const tempPath = '/classes/products/RJO6BD61U9'
        const options = {
            hostname : 'localhost',
        }

        const restController = new RestController(adapter);
        restController.request('GET', tempPath, options)
            .then((response) => {
                console.log(response)
                done();
            })
            .catch(done.fail);
    });
    xit('should execute POST request', function(done){
        const testProduct = {
            name : 'Mouse pad',
            price : 899
        }
        const adapter = {
            request : jasmine.createSpy().and.returnValue(Promise.resolve(testProduct))
        }

        const restController = new RestController(adapter);
        const testPath = '/classes/products/'
        const options = {
            body : testProduct
        }

        restController.request('POST', testPath, options)
            .then((response) => {
                console.log(response);
                done();
            })
            .catch(done.fail);
    });
    xit('should execute PUT request', function(done){
        const document = {
            name : 'Laptop'
        }
        const adapter = {
            request : jasmine.createSpy().and.returnValue(Promise.resolve(document))
        };

        const testPath = '/classes/products/Mug/';
        const options = {
            body : document
        };

        const restController = new RestController(adapter);
        restController.request('PUT', testPath, options)
            .then((response) => {
                console.log(response);
                done();
            })
            .catch(done.fail);
    });
    xit('should execute DELETE request', function(done){
        const id = 'RJO6BD61U9'
        const adapter  = {
            request : jasmine.createSpy().and.callFake(() => { console.log('item deleted') })
        }
        const testPath = '/classes/products/' + id
        const restController = new RestController(adapter);
        restController.request('DELETE', testPath)
            .then(() => {
                done();
            })
            .catch(done.fail);
    });

    //with real adapter
    xit('should execute GET request', function(done){
        const tempPath = '/classes/products/RJO6BD61U9'
        const options = {
            hostname : 'localhost',
        }
        getRestController().request('GET', tempPath, options)
            .then((response) => {
                console.log(response)
                done();
            })
            .catch(done.fail);
    });
    xit('should execute POST request', function(done){
        const testPath = '/classes/products';
        //sample data
        const tempBody = {
            'name' : 'Pencil',
            'price' : 2999
        }

        const options = {
            body : tempBody
        };
        getRestController().request('POST', testPath, options)
            .then((response) => {
                console.log(response);
                done();
            })
            .catch(done.fail)



    });
    xit('should execute PUT request', function(done){
        const productId = 'RJO6BD61U9'
        const testPath = '/classes/products/' + productId;
        const testBody = {
            'price' : 100000
        }
        const options = {
            body : testBody
        }
        getRestController().request('PUT', testPath, options)
            .then((response) => {
                console.log(response);
                done();
            })
            .catch(done.fail);
    });
    xit('should execute DELETE request', function(done){
        const productId = 'AR6LG4X9ZX'
        const testPath = '/classes/products/' + productId;
        const options = {}
        getRestController().request('DELETE', testPath, options)
            .then((response) => {
                expect(response).toEqual({})
                done();
            })
            .catch(done.fail);
    });
});
