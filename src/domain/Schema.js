const getRestController = require('../controllers/rest');

class Schema {
    constructor() {
        this.rest = getRestController();
    }

    create(schema) {
        const options = {
            body: schema
        }
        return this.rest.request('POST', '/schemas', options);
    };

    get(name) {
        const path = '/schemas/' + name
        return this.rest.request('GET', path)
    }

    find() {
        const path = '/schemas'
        return this.rest.request('GET', path);
    }

    update(schema) {
        const path = '/schemas/' + schema.collection
        const options = {
            body: schema
        }
        return this.rest.request('PUT', path, options);
    }

    delete(collection) {
        const path = '/schemas/' + collection
        return this.rest.request('DELETE', path);
    }

}

module.exports = Schema;
