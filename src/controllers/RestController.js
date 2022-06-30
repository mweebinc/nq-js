const Config = require('../Config');

class RestController {
    constructor(adapter, cache) {
        this.adapter = adapter;
        this.cache = cache;
    }

    getSession() {
        this.cache.get('token')
            .then((session) => {
                this.session = session;
            })
    }

    setSession(session) {
        this.cache.set({'token': session});
    }

    clearSession() {
        this.cache.clear()
    }

    setAppId() {
        this.appId = Config.get('APPLICATION_ID');
    }

    getUrl(path) {
        const base = Config.get('SERVER_URL');
        return new URL(base + path);
    }

    writeHeader() {
        this.headers = {};
        this.headers['Content-Type'] = 'application/json';
        this.headers['X-Application-Id'] = this.appId;
        if (this.session) {
            this.headers['X-Session-Token'] = this.session.token
        }
    }

    init(path) {
        return Promise.resolve()
            .then(() => this.setAppId())
            .then(() => this.getSession())
            .then(() => this.writeHeader())
            .then(() => this.getUrl(path));
    }

    request(method, path, options = {}) {
        if (options && options.body) {
            if(typeof options.body === 'object'){
                options.body = JSON.stringify(options.body);
            }
        }
        return Promise.resolve()
            .then(() => this.init(path))
            .then((url) => this.send(url, {method, ...options}));
    }

    send(url, options) {
        if (options.query) {
            for (const p in options.query) {
                url.searchParams.set(p, JSON.stringify(options.query[p]));
            }
        }
        if (options.headers) {
            this.headers = Object.assign(this.headers, options.headers)
        }
        if (options.session) {
            this.headers['X-Session-Token'] = options.session;
        }
        const _options = {
            method: options.method,
            body: options.body,
            headers: this.headers
        }
        return this.adapter.request(url, _options)
            .catch(error => {
                if (error.code === 209) {
                    this.cache.clear();
                }
                throw error;
            });
    }
}

module.exports = RestController;
