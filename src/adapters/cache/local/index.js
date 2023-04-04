const LocalStorageAdapter = require('./LocalStorageAdapter')

function getCacheAdapter() {
    return new LocalStorageAdapter(window.localStorage);
}

module.exports = getCacheAdapter;


