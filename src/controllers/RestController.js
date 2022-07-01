const Config = require('../Config');
const SESSION_KEY = 'session';

class RestController {
    constructor(adapter, cache) {
        this.adapter = adapter;
        this.cache = cache;
    }
    getSession(session) {
        this.cache.get(SESSION_KEY)
            .then((_session) => {
                this.session = session || _session;
            });
    }
    setSession(session) {
        this.cache.put(SESSION_KEY, session);
    }
    clearSession() {
        return this.cache.clear()
    }
    getAppId() {
        this.appId = Config.get('APPLICATION_ID');
    }
    getUrl(method, path, body) {
        const base = Config.get('SERVER_URL');
        const url = new URL(base + path);
        if (method === 'GET' && body) {
            for (const p in body) {
                url.searchParams.set(p, JSON.stringify(body[p]));
            }
        }
        return url;
    }

    writeHeader(headers) {
        this.headers = headers || {};
        this.headers['Content-Type'] = this.contentType;
        this.headers['X-Application-Id'] = this.appId;
        if (this.session) {
            this.headers['X-Session-Token'] = this.session;
        }
    }

    getContentType(body) {
        this.contentType = 'application/json';
    }

    getBody(body) {
        if (body && typeof body === 'object') {
            return JSON.stringify(body);
        }
    }
    request(method, path, options = {}, session) {
        return Promise.resolve()
            .then(() => this.getAppId())
            .then(() => this.getSession(session))
            .then(() => this.getContentType(options.body))
            .then(() => this.writeHeader(options.headers))
            .then(() => this.getUrl(method, path, options.body))
            .then((url) => this._request(url, method, options.body));
    }

    _request(url, method, body) {
        const options = {
            method: method,
            headers: this.headers
        };
        if (options.method === 'POST' && body) {
            options.body = this.getBody(body);
        }
        return this.adapter.request(url, options)
            .catch(error => {
                if (error.code === 209) {
                    this.cache.clear();
                }
                throw error;
            });
    }
}

module.exports = RestController;
