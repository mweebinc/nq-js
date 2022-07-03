const RestController = require('./RestController')

function getRestController() {
    let restAdapter;
    let cacheAdapter;

    if (window) {
        const getXhrAdapter = require('../adapters/rest/xhr');
        const getCacheAdapter = require('../adapters/cache/local');
        restAdapter = getXhrAdapter();
        cacheAdapter = getCacheAdapter(NaN);
    } else {
        // const getHttpRestAdapter = require('../adapters/rest/http');
        // const getMemoryCacheAdapter = require('../adapters/cache/memory');
        // restAdapter = getHttpRestAdapter();
        // cacheAdapter = getMemoryCacheAdapter(NaN);
    }
    return new RestController(restAdapter, cacheAdapter);
}

module.exports = getRestController
