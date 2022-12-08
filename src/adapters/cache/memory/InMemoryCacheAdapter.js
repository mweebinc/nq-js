const InMemoryCache = require('./InMemoryCache');

class InMemoryCacheAdapter {
    constructor(ttl) {
        this.cache = new InMemoryCache(ttl);
    }

    get(key) {
        const record = this.cache.get(key);
        return Promise.resolve(record);
    }

    put(key, value, ttl) {
        this.cache.put(key, value, ttl);
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

module.exports = InMemoryCacheAdapter;
