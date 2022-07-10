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

    update(collection, document) {
        const path = ENDPOINT + collection + '/' + document.id
        const options = {
            body: document
        }
        return this.rest.request('PUT', path, options);
    }

    delete(collection, id) {
        const path = ENDPOINT + collection + '/' + id
        return this.rest.request('DELETE', path)
    }

    get(collection, id) {
        const path = ENDPOINT + collection + '/' + id;
        return this.rest.request('GET', path)
    }

    find(collection, query, session) {
        const path = ENDPOINT + collection;
        return this.rest.request('GET', path, {body: query}, session);
    }

    static find(collection, query, session) {
        const document = new this();
        return document.find(collection, query, session);
    }

    static create(collection, document, session) {
        const _document = new this();
        return _document.create(collection, document, session);
    }
}

module.exports = Document;
