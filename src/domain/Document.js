const getController = require('../controllers/rest');
const ENDPOINT = '/collections/'

// Object has reserved keyword so we used Document instead
class Document {
    constructor() {
        this.rest = getController();
    }

    create(collection, document, options = {}) {
        const path = ENDPOINT + collection
        const _options = {
            body: document,
            timeout: options.timeout,
            session: options.session,
        }
        return this.rest.request('POST', path, _options)
    }

    get(collection, id, options = {}) {
        const path = ENDPOINT + collection + '/' + id;
        const _options = {
            params: options.params,
            timeout: options.timeout,
            session: options.session,
        }
        return this.rest.request('GET', path, _options);
    }

    find(collection, query, options = {}) {
        const path = ENDPOINT + collection;
        const _options = {
            body: query,
            timeout: options.timeout,
            session: options.session,
        }
        return this.rest.request('GET', path, _options);
    }

    update(collection, document, options = {}) {
        const path = ENDPOINT + collection + '/' + document.id
        const _options = {
            body: document,
            params: options.params,
            timeout: options.timeout,
            session: options.session,
        }
        return this.rest.request('PUT', path, _options);
    }

    delete(collection, id, options = {}) {
        const path = ENDPOINT + collection + '/' + id
        const _options = {
            timeout: options.timeout,
            session: options.session
        }
        return this.rest.request('DELETE', path, _options);
    }

    aggregate(collection, pipeline, options = {}) {
        const path = '/aggregate/' + collection;
        const _options = {
            body: {pipeline},
            timeout: options.timeout,
            session: options.session
        }
        return this.rest.request('GET', path, _options);
    }

    distinct(collection, field, query, options) {
        const path = '/distinct/' + collection
        const _options = {
            timeout: options.timeout,
            session: options.session
        }
        return this.rest.request('GET', path, _options);
    }

    abort() {
        this.rest.abort();
    }
}

module.exports = Document;
