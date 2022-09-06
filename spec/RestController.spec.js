const RestController = require('../src/controllers/rest/RestController');
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
    it('should add query in GET request', function (done) {
        const method = 'GET';
        const path = '/collections';
        const options = {
            body: {
                where: {name: 'john', age: 28},
                include: ['all']
            }
        }
        restController.request(method, path, options)
            .then((result) => {
                expect(result.url.search).toEqual('?where=%7B%22name%22%3A%22john%22%2C%22age%22%3A28%7D&include=%5B%22all%22%5D');
                expect(result.options.method).toEqual('GET');
                expect(result.options.body).toBeUndefined();
                done();
            })
            .catch(done.fail);
    });
    it('should POST request', function (done) {
        const method = 'POST';
        const path = '/collections';
        const body = {name: 'john'};
        const options = {
            body
        };
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
    it('should PUT request', function (done) {
        const method = 'PUT';
        const path = '/collections';
        const body = {name: 'john'};
        const options = {body};
        restController.request(method, path, options)
            .then((result) => {
                expect(result.url.href).toEqual('http://api.innque.com/v1/collections');
                expect(result.options.method).toEqual('PUT');
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
    it('should custom header', function (done) {
        const method = 'POST';
        const path = '/files/';
        const options = {
            body: 'hello',
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        restController.request(method, path, options)
            .then((result) => {
                expect(result.options.headers).toEqual({
                        'Content-Type': 'text/plain',
                        'X-Application-Id': 'test'
                    }
                );
                expect(result.options.body).toEqual('hello');
                done();
            })
            .catch(done.fail);
    });

    it('should add query in PUT request', function (done) {
        const method = 'PUT';
        const path = '/collections';
        const body = {name: 'john'};
        const options = {
            body,
            params: {upsert: true}
        };
        restController.request(method, path, options)
            .then((result) => {
                expect(result.url.href).toEqual('http://api.innque.com/v1/collections?upsert=true');
                expect(result.options.method).toEqual('PUT');
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
});
