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


    static create(collection, document, session) {
        const _document = new this();
        return _document.create(collection, document, session);
    }

    static get(collection, id, session) {
        const document = new this();
        return document.get(collection, id, session);
    }

    static find(collection, query, session) {
        const document = new this();
        return document.find(collection, query, session);
    }

    static update(collection, document, session) {
        const _document = new this();
        return _document.update(collection, document, session);
    }

    static delete(collection, id, session) {
        const document = new this();
        return document.delete(collection, id, session);
    }
}

module.exports = Document;
