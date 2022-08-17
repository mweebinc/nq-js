const Config = require('../../Config');
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

    getDefaultHeaders() {
        const headers = {};
        headers['Content-Type'] = 'application/json';
        headers['X-Application-Id'] = this.appId;
        if (this.session) {
            headers['X-Session-Token'] = this.session;
        }
        return headers;
    }

    transformBody(body, type) {
        switch (type) {
            case 'application/json':
                return JSON.stringify(body);
            default:
                return body;
        }
    }

    request(method, path, options = {}, session) {
        return Promise.resolve()
            .then(() => this.getAppId())
            .then(() => this.getSession(session))
            .then(() => this.getUrl(method, path, options.body))
            .then((url) => this._request(url, method, options.body, options.headers));
    }

    _request(url, method, body, headers) {
        const options = {
            method: method,
            headers: Object.assign(this.getDefaultHeaders(), headers)
        };
        // body data only allowed in POST and PUT method
        if (body && options.method === 'POST' || options.method === 'PUT') {
            options.body = this.transformBody(body, options.headers['Content-Type']);
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
