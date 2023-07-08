const Config = require('../../Config');
const SESSION_KEY = 'SESSION';
const APPLICATION_ID_KEY = 'APPLICATION_ID';

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
        this.cache.get(APPLICATION_ID_KEY)
            .then((id) => {
                this.appId = Config.get(APPLICATION_ID_KEY) || id;
            });
    }

    setAppId(id) {
        this.cache.put(APPLICATION_ID_KEY, id);
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

    request(method, path, {params, session, ...options} = {}) {
        return Promise.resolve()
            .then(() => this.getAppId())
            .then(() => this.getSession(session))
            .then(() => this.getUrl(method, path, options.body, params))
            .then((url) => this._request(url, method, options));
    }

    abort() {
        this.adapter.abort();
    }

    _request(url, method, {headers, body, ...other}) {
        const options = {
            method: method,
            headers: Object.assign(this.getDefaultHeaders(), headers),
            ...other
        };
        // body data only allowed in POST and PUT method
        if (body && method === 'POST' || method === 'PUT') {
            options.body = this.transformBody(body, options.headers['Content-Type']);
        }
        return this.adapter.request(url, options)
            .catch(error => {
                // if invalid session token
                if (error.code === 401) {
                    this.clearSession();
                }
                throw error;
            });
    }
}

module.exports = RestController;
