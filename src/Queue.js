const Collection = require('./domain/Collection');
const Document = require('./domain/Document');
const User = require('./domain/User');
const File = require('./domain/File');
const Config = require('./Config');
const LiveQuery = require('./livequery/LiveQuery');

class Queue {
    static setUrl(value) {
        Config.set('SERVER_URL', value);
    }

    static setApplicationId(value) {
        Config.set('APPLICATION_ID', value);
    }
}

Queue.User = User;
Queue.Collection = Collection;
Queue.Document = Document;
Queue.LiveQuery = LiveQuery;
Queue.File = File;
module.exports = Queue;
