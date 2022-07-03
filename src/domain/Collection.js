const getRestController = require('../controllers/rest');

class Collection {
    constructor() {
        this.rest = getRestController();
    }

    create(schema) {
        const options = {
            body: schema
        }
        return this.rest.request('POST', '/schemas', options);
    };

    update(schema) {
        const path = '/schemas/' + schema.name
        const options = {
            body: schema
        }
        return this.rest.request('PUT', path, options);
    }

    find(schemaId) {
        const path = '/schemas/' + schemaId
        return this.rest.request('GET', path)
    }

    delete(schemaName) {
        const path = '/schemas/' + schemaName
        return this.rest.request('DELETE', path);
    }

    findAll() {
        const path = '/schemas'
        return this.rest.request('GET', path);
    }
}

module.exports = Collection;
