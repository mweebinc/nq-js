const DEFAULT_CACHE_TTL = 5 * 1000;

class InMemoryCache {
    constructor(ttl = DEFAULT_CACHE_TTL) {
        this.ttl = ttl;
        this.cache = Object.create(null);
    }
    put(key, value, ttl = this.ttl) {
        if (ttl < 0 || isNaN(ttl)) {
            ttl = NaN;
        }
        const record = {value: value, expire: Date.now() + ttl};
        if (!isNaN(record.expire)) {
            record.timeout = setTimeout(() => {
                this.delete(key);
            }, ttl);
        }
        this.cache[key] = record;
    }
    get(key) {
        const record = this.cache[key];
        if (record == null) {
            return null;
        }
        // Has Record and isn't expired
        if (isNaN(record.expire) || record.expire >= Date.now()) {
            return record.value;
        }
        // Record has expired
        delete this.cache[key];
        return null;
    }
    delete(key) {
        const record = this.cache[key];
        if (record == null) {
            return;
        }
        if (record.timeout) {
            clearTimeout(record.timeout);
        }
        delete this.cache[key];
    }
    clear() {
        this.cache = Object.create(null);
    }
}
module.exports = InMemoryCache;
