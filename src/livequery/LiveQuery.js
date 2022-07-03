const EventEmitter = require('events');
const getLiveQueryClient = require('./');
const Config = require('../Config');

const url = Config.get('LIVEQUERY_SERVER_URL') || Config.get('SERVER_URL').replace('http', 'ws');
const applicationId = Config.get('APPLICATION_ID');
const client = getLiveQueryClient(url, applicationId);

const LiveQuery = new EventEmitter();

client.on('open', () => setTimeout(() => LiveQuery.emit('open'), 100));
client.on('error', (error) => setTimeout(() => LiveQuery.emit('error', error), 100));
LiveQuery.open = () => {
    client.open();
};
LiveQuery.subscribe = (query) => {
    return client.subscribe(query);
};

// client.on('close', () => LiveQuery.emit('close'));

module.exports = LiveQuery;


