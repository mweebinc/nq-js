/**
 * A class that provides a simple interface for storing and retrieving data in
 * the browser's local storage.
 */
class LocalStorageAdapter {
    constructor(localStorage) {
        this.localStorage = localStorage;
    }

    put(key, value) {
        this.localStorage.setItem(key, value);
        return Promise.resolve();
    }

    get(key) {
        const record = this.localStorage.getItem(key);
        return Promise.resolve(record);
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
