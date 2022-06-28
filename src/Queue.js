const User = require('./domain/User');
const Collection = require('./domain/Collection');
const Document = require('./domain/Document');
const Config = require('./Config')

//gateway
class Queue{
    static User = User;
    static Collection = Collection;
    static Document = Document;


    static setApplicationId(value){
        Config.set('APPLICATION_ID', value);
    }
    static setMasterKey(value){
        Config.set('MASTER_KEY', value);
    }
    static setUrl(value){
        Config.set('SERVER_URL', value);
    }
}
module.exports = Queue;
