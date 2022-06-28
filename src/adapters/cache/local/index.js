const LocalStorageAdapter = require('./LocalStorageAdapter')

function getCacheAdapter(ttl) {
    if(typeof window !== 'undefined'){
        return new LocalStorageAdapter(window.localStorage, ttl);
    }




}

module.exports = getCacheAdapter;


