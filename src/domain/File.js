const Config = require('../Config');
const getController = require('../controllers/rest');
const ENDPOINT = '/files/';

class File {
    constructor() {
        this.rest = getController();
    }

    save(blob, options = {}) {
        const _options = {
            body: blob, headers: {'Content-Type': blob.type}, progress: options.progress
        }
        return this.rest.request('POST', ENDPOINT + blob.name, _options, options.session);
    }

    delete(path) {
        const url = new URL(path);
        const name = url.pathname.split('/').pop();
        return this.rest.request('DELETE', ENDPOINT + name);
    }

    static get(path, {applicationId} = {}) {
        if (path && path.startsWith('http')) {
            const search = Object.fromEntries(new URLSearchParams(window.location.search));
            applicationId = applicationId || search.applicationId || Config.get('APPLICATION_ID');
            path = path.split('/').pop();
            return Config.get('SERVER_URL') + '/files/' + applicationId + '/' + path;
        }
        return path;
    }

    // deprecated
    static getFile(path) {
        path = path.split('/').pop();
        return Config.get('SERVER_URL') + '/files/' + Config.get('APPLICATION_ID') + '/' + path;
    }

    // deprecated
    static getPath(path) {
        path = path.split('/').pop();
        return Config.get('SERVER_URL') + '/files/' + Config.get('APPLICATION_ID') + '/' + path;
    }

    static getFilename(url) {
        // return path.split('/').pop();
        const pathname = new URL(url).pathname;
        const filename = pathname.split('/').pop(); // Get the last segment of the pathname
        return decodeURIComponent(filename); // Decode any percent-encoded characters
    }
}

module.exports = File;
