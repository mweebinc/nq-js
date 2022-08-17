const Config = require('../Config');
const getController = require('../controllers/rest');
const ENDPOINT = '/files/';

class File {
    constructor() {
        this.rest = getController();
    }

    save(blob, session) {
        const options = {
            'body': blob,
            'headers': {'Content-Type': blob.type}
        }
        return this.rest.request('POST', ENDPOINT + blob.name, options, session);
    }

    static save(blob, session) {
        const file = new this();
        return file.save(blob, session);
    }

    static getFile(path) {
        path = path.split('/').pop();
        return Config.get('SERVER_URL') + '/files/' + Config.get('APPLICATION_ID') + '/' + path;
    }
}

module.exports = File;
