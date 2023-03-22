class LocalStorageAdapter {
    constructor(localStorage, ttl = NaN) {
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
        return Promise.resolve();
    }
    get(key) {
        let record = this.localStorage.getItem(key);
        if (record == null) {
            return Promise.resolve(record);
        }
        record = JSON.parse(record);
        // Has Record and isn't expired
        if (!record.expire || record.expire >= Date.now()) {
            return Promise.resolve(record.value);
        }
        // Record has expired
        this.delete(key);
        return Promise.resolve(null);
    }
    delete(key) {
        this.localStorage.removeItem(key);
        return Promise.resolve();
    }
    clear() {
        this.localStorage.clear();
        return Promise.resolve();
    }
}

module.exports = LocalStorageAdapter;
