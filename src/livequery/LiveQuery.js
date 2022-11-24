const EventEmitter = require('events');
const getLiveQueryClient = require('./');
const Config = require('../Config');


const Client = (function () {
    let instance;

    function createInstance() {
        const url = Config.get('LIVEQUERY_SERVER_URL') || Config.get('SERVER_URL').replace('http', 'ws');
        const applicationId = Config.get('APPLICATION_ID');
        const client = getLiveQueryClient(url, applicationId);
        client.on('open', () => setTimeout(() => LiveQuery.emit('open'), 100));
        client.on('error', (error) => setTimeout(() => LiveQuery.emit('error', error), 100));
        client.on('close', () => LiveQuery.emit('close'));
        return client;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


const LiveQuery = new EventEmitter();


LiveQuery.open = () => {
    const client = Client.getInstance();
    client.open();
};
LiveQuery.subscribe = (query) => {
    const client = Client.getInstance();
    return client.subscribe(query);
};


module.exports = LiveQuery;


