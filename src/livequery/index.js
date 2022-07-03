const LiveQueryClient = require('./LiveQueryClient');
const Socket = require('../adapters/socket/ws/Socket');

function getLiveQueryClient(url, applicationId, sessionToken) {
    const socket = new Socket(url);
    const client = new LiveQueryClient(socket, applicationId, sessionToken);
    return client;
}

module.exports = getLiveQueryClient;
