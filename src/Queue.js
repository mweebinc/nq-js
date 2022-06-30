const Collection = require('./domain/Collection');
const Document = require('./domain/Document');
const User = require('./domain/User');
const Config = require('./Config');

class Queue {

    static setUrl(value) {
        Config.set('SERVER_URL', value);
    }

    static setApplicationId(value) {
        Config.set('APPLICATION_ID', value);
    }

    static setMasterKey(value) {
        Config.set('MASTER_KEY', value);
    }

}

Queue.User = User;
Queue.Collection = Collection;
Queue.Document = Document;
module.exports = Queue;
