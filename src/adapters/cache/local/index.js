const LocalStorageAdapter = require('./LocalStorageAdapter')

function getCacheAdapter(ttl) {
    return new LocalStorageAdapter(window.localStorage, ttl);
}

module.exports = getCacheAdapter;


