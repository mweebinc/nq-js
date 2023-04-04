const CacheController = require('./CacheController')

function getCacheController(ttl) {
    let adapter;
    if (window) {
        const getCacheAdapter = require('../../adapters/cache/local');
        adapter = getCacheAdapter();
    } else {
    }
    return new CacheController(adapter, ttl);
}

module.exports = getCacheController
