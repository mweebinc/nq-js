const Config = require('../Config');
const getController = require('../controllers/rest');
const ENDPOINT = '/files/';

class File {
    constructor() {
        this.rest = getController();
    }

    save(blob, options = {}) {
        const _options = {
            body: blob,
            headers: {'Content-Type': blob.type},
            progress: options.progress
        }
        return this.rest.request('POST', ENDPOINT + blob.name, _options, options.session);
    }

    static getFile(path) {
        path = path.split('/').pop();
        return Config.get('SERVER_URL') + '/files/' + Config.get('APPLICATION_ID') + '/' + path;
    }
}

module.exports = File;
