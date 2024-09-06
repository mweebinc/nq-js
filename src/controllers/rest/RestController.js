const Config = require('../../Config');
const SESSION_KEY = 'SESSION';
const APPLICATION_ID_KEY = 'APPLICATION_ID';

class RestController {
    constructor(adapter, cache) {
        this.adapter = adapter;
        this.cache = cache;
    }
    getSession() {
        return this.cache.get(SESSION_KEY);
    }
    setSession(session) {
        return this.cache.put(SESSION_KEY, session);
    }
    clearSession() {
        return this.cache.delete(SESSION_KEY);
    }
    getAppId() {
        const {applicationId} = Object.fromEntries(new URLSearchParams(window.location.search));
        return applicationId || Config.get(APPLICATION_ID_KEY);
    }
    getUrl(method, path, body, params) {
        const base = Config.get('SERVER_URL');
        const url = new URL(base + path);
        const setParams = (obj) => {
            for (const p in obj) {
                url.searchParams.set(p, JSON.stringify(obj[p]));
            }
        };
        if (method === 'GET' && body) {
            setParams(body);
        }
        if (params) {
            setParams(params);
        }
        return url;
    }
    async request(method, path, {params, session, applicationId, body, headers,...res}={}) {
        headers = headers || {};
        applicationId = applicationId || await this.getAppId();
        session = session || await this.getSession();
        // create headers
        if (session) {
            headers['X-Session-Token'] = session;
        }
        headers['X-Application-Id'] = applicationId;
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        //
        const url = this.getUrl(method, path, body, params);
        // body data only allowed in POST and PUT methods
        if (body && (method === 'POST' || method === 'PUT')) {
            if (headers['Content-Type'] === 'application/json') {
                body =  JSON.stringify(body);
            }
        }
        // create options to request
        const options = {
            method: method,
            headers: headers,
            body: body,
            ...res
        };
        try {
            return await this.adapter.request(url, options);
        } catch (error) {
            // if invalid session token
            if (error.code === 401) {
                await this.clearSession();
            }
            throw error;
        }
    }
    abort() {
        this.adapter.abort();
    }
}

module.exports = RestController;
