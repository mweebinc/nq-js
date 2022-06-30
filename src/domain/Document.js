const getController = require('../controllers')
const ENDPOINT = '/classes/'

class Document {
    constructor() {
        this.rest = getController();
    }

    create(collection, document) {
        const path = ENDPOINT + collection
        const options = {
            body: document
        }
        return this.rest.request('POST', path, options)
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

    find(collection) {
        const path = ENDPOINT + collection
        return this.rest.request('GET', path);
    }
}

module.exports = Document;
