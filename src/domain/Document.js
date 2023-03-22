const getController = require('../controllers/rest');
const ENDPOINT = '/classes/'

class Document {
    constructor() {
        this.rest = getController();
    }
    create(collection, document, session) {
        const path = ENDPOINT + collection
        const options = {
            body: document
        }
        return this.rest.request('POST', path, options, session)
    }
    get(collection, id) {
        const path = ENDPOINT + collection + '/' + id;
        return this.rest.request('GET', path)
    }
    find(collection, query, session) {
        const path = ENDPOINT + collection;
        return this.rest.request('GET', path, {body: query}, session);
    }
    update(collection, document, options, session) {
        const path = ENDPOINT + collection + '/' + document.id
        const _options = {
            body: document,
            params: options
        }
        return this.rest.request('PUT', path, _options, session);
    }
    delete(collection, id, session) {
        const path = ENDPOINT + collection + '/' + id
        return this.rest.request('DELETE', path, {}, session);
    }
}

module.exports = Document;
