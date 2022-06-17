const KEY = 'SESSION';

class UserCache {
    constructor(adapter) {
        this.adapter = adapter;
    }
    set(session) {
        return this.adapter.put(KEY, session);
    }
    get() {
        return this.adapter.get(KEY);
    }
    clear() {
        return this.adapter.delete(KEY);
    }
}
module.exports = UserCache;
