const LocalStorage = require('./LocalStorage')

class LocalStorageAdapter {
    constructor(localStorage, ttl) {
        this.cache = new LocalStorage(localStorage, ttl);
    }

    get(key) {
        const record = this.cache.get(key);
        console.log(record);
        return Promise.resolve(record);
    }

    put(key, value) {
        this.cache.put(key, value);
        return Promise.resolve();
    }

    delete(key) {
        this.cache.delete(key);
        return Promise.resolve();
    }

    clear() {
        this.cache.clear();
        return Promise.resolve();
    }
}

module.exports = LocalStorageAdapter;
