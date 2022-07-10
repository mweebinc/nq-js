const getController = require('../controllers/rest');
const ENDPOINT = '/files/';

class File {
    constructor() {
        this.rest = getController();
    }

    save(blob, session) {
        const options = {
            body: blob
        }
        return this.rest.request('POST', ENDPOINT + blob.name, options, session);
    }

    static save(blob, session) {
        const file = new this();
        return file.save(blob, session);
    }
}

module.exports = File;
