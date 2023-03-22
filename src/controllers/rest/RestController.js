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
        return this.cache.delete(SESSION_KEY);
    }

    getAppId() {
        this.appId = Config.get('APPLICATION_ID');
    }

    getUrl(method, path, body, params) {
        const base = Config.get('SERVER_URL');
        const url = new URL(base + path);
        if (method === 'GET' && body) {
            for (const p in body) {
                url.searchParams.set(p, JSON.stringify(body[p]));
            }
        }
        if (params) {
            for (const p in params) {
                url.searchParams.set(p, JSON.stringify(params[p]));
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
            .then(() => this.getUrl(method, path, options.body, options.params))
            .then((url) => this._request(url, method, options));
    }

    abort() {
        this.adapter.abort();
    }

    _request(url, method, options) {
        const _options = {
            method: method,
            headers: Object.assign(this.getDefaultHeaders(), options.headers),
            progress: options.progress
        };
        // body data only allowed in POST and PUT method
        if (options.body && _options.method === 'POST' || _options.method === 'PUT') {
            _options.body = this.transformBody(options.body, _options.headers['Content-Type']);
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
