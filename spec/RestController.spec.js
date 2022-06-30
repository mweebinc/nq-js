const RestController = require('../src/controllers/RestController');
const Config = require('../src/Config');

Config.set('SERVER_URL', 'http://api.innque.com/v1');
Config.set('APPLICATION_ID', 'test');

describe('RestController', () => {
    let restAdapter;
    let cacheAdapter;
    let restController;
    beforeEach(() => {
        restAdapter = {
            request: jasmine.createSpy().and.callFake(function (url, options) {
                return Promise.resolve({url, options});
            })
        };
        cacheAdapter = {
            set: jasmine.createSpy().and.callFake(function (key, value) {
                return Promise.resolve();
            }),
            get: jasmine.createSpy().and.callFake(function (key) {
                return Promise.resolve();
            })
        };
        restController = new RestController(restAdapter, cacheAdapter);
    });
    
    it('should GET request', function (done) {
        const method = 'GET';
        const path = '/collections';
        restController.request(method, path)
            .then((result) => {
                expect(result.url.href).toEqual('http://api.innque.com/v1/collections');
                expect(result.options.method).toEqual('GET');
                expect(result.options.body).toBeUndefined();
                expect(result.options.headers).toEqual({
                        'Content-Type': 'application/json',
                        'X-Application-Id': 'test'
                    }
                );
                done();
            })
            .catch(done.fail);
    });
    it('should POST request', function (done) {
        const method = 'POST';
        const path = '/collections';
        const body = {name: 'john'};
        const options = {body};
        restController.request(method, path, options)
            .then((result) => {
                expect(result.url.href).toEqual('http://api.innque.com/v1/collections');
                expect(result.options.method).toEqual('POST');
                expect(result.options.body).toEqual(JSON.stringify(body));
                expect(result.options.headers).toEqual({
                        'Content-Type': 'application/json',
                        'X-Application-Id': 'test'
                    }
                );
                done();
            })
            .catch(done.fail);
    });
    it('should request POST multiple', function (done) {
        const method = 'POST';
        const path1 = '/users';
        const body1 = {name: 'john'};
        const path2 = '/addresses';
        const body2 = {city: ',manila'};
        const promises = [];
        promises.push(restController.request(method, path1, {body: body1}));
        promises.push(restController.request(method, path2, {body: body2}));
        Promise.all(promises)
            .then((results) => {
                expect(results[0].url.href).toEqual('http://api.innque.com/v1/users');
                expect(results[0].options.body).toEqual(JSON.stringify(body1));
                expect(results[1].url.href).toEqual('http://api.innque.com/v1/addresses');
                expect(results[1].options.body).toEqual(JSON.stringify(body2));
                done();
            })
            .catch(done.fail);
    });
});
