const DEFAULT_CACHE_TTL = 5 * 1000;

class LocalStorage {
    constructor(localStorage, ttl = DEFAULT_CACHE_TTL) {
        this.localStorage = localStorage;
        this.ttl = ttl;
    }

    put(key, value, ttl = this.ttl) {
        if (ttl < 0 || isNaN(ttl)) {
            ttl = NaN;
        }
        const record = {value: value, expire: Date.now() + ttl};
        if (!isNaN(record.expire)) {
            setTimeout(() => this.delete(key), ttl);
        }
        this.localStorage.setItem(key, JSON.stringify(record));
    }

    get(key) {

        let record = this.localStorage.getItem(key);
        if (record == null) {
            return null;
        }
        record = JSON.parse(record);
        // Has Record and isn't expired
        if (!record.expire || record.expire >= Date.now()) {
            return record.value;
        }
        // Record has expired
        this.delete(key);
        return null;
    }

    delete(key) {
        this.localStorage.removeItem(key);
    }

    clear() {
        this.localStorage.clear();
    }
}

module.exports = LocalStorage;
