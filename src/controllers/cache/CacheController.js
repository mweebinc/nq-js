class CacheController {
    constructor(adapter, ttl) {
        this.adapter = adapter;
        this.ttl = ttl;
    }

    put(key, value, ttl = this.ttl) {
        // check if ttl is number
        if (ttl < 0 || isNaN(ttl)) {
            ttl = NaN;
        }
        const record = {value: value, expire: Date.now() + ttl};
        if (!isNaN(record.expire)) {
            setTimeout(() => this.delete(key), ttl);
        }
        // save cache as always text format
        return this.adapter.put(key, JSON.stringify(record));
    }

    /**
     * @param key
     * @returns {Promise<*>} return undefine if no value found
     */
    async get(key) {
        try {
            let record = await this.adapter.get(key);
            record = JSON.parse(record);
            // Has Record and isn't expired
            if (!record.expire || record.expire >= Date.now()) {
                return record.value;
            }
            // Record has expired
            this.delete(key);
        } catch (error) {
            // ignore error message
        }
    }

    delete(key) {
        return this.adapter.delete(key);
    }

    clear() {
        return this.adapter.clear();
    }
}

module.exports = CacheController;
