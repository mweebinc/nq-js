const CacheController = require('../src/controllers/cache/CacheController');
describe('CacheController', function () {
    it('should put and get', async function () {
        const data = {};
        const adapter = {
            put: (key, value) => {
                data[key] = value;
                return Promise.resolve();
            },
            get: (key) => {
                return Promise.resolve(data[key]);
            }
        };
        const cache = new CacheController(adapter);
        await cache.put('test', 'foo');
        const value = await cache.get('test');
        expect(value).toEqual('foo');
    });
    it('should handle null value', async function () {
        const data = {};
        const adapter = {
            put: (key, value) => {
                data[key] = value;
                return Promise.resolve();
            },
            get: (key) => {
                return Promise.resolve(data[key]);
            }
        };
        const cache = new CacheController(adapter);
        const value = await cache.get('test');
        expect(value).toEqual(undefined);
    });
});