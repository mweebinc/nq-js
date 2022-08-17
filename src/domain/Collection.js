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

    get(name) {
        const path = '/schemas/' + name
        return this.rest.request('GET', path)
    }

    find() {
        const path = '/schemas'
        return this.rest.request('GET', path);
    }

    update(schema) {
        const path = '/schemas/' + schema.name
        const options = {
            body: schema
        }
        return this.rest.request('PUT', path, options);
    }

    delete(name) {
        const path = '/schemas/' + name
        return this.rest.request('DELETE', path);
    }


    static create(schema) {
        const collection = new this();
        return collection.create(schema);
    }

    static get(name) {
        const collection = new this();
        return collection.get(name);
    }

    static find() {
        const collection = new this();
        return collection.find();
    }

    static update(schema) {
        const collection = new this();
        return collection.update(schema);
    }

    static delete(name) {
        const collection = new this();
        return collection.delete(name);
    }


}

module.exports = Collection;
