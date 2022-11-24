const Config = require('../src/Config');
const http = require('http');
WebSocket = require('ws');

const port = 5683;
const url = 'ws://localhost:' + port;
const applicationId = 'appId';
Config.set('LIVEQUERY_SERVER_URL', url);
Config.set('APPLICATION_ID', applicationId);

const LiveQuery = require('../src/livequery/LiveQuery');

class SocketServer {
    constructor(server) {
        this.server = server;
    }

    start() {
        return new Promise((resolve) => {
            this.wss = new WebSocket.Server({server: this.server});
            this.wss.on('listening', resolve);
            this.wss.on('connection', this._onConnection);
            this.wss.on('error', this._onError);
        });
    }

    _onConnection(ws) {
        ws.onmessage = data => {
            data = data && data.data ? data.data : data;
            data = JSON.parse(data);
            switch (data.operation) {
                case 'connect':
                    ws.send(JSON.stringify({
                        operation: 'connected'
                    }));
                    break;
                case 'subscribe':
                    ws.send(JSON.stringify(
                        {
                            operation: 'subscribed',
                            subscriptionId: data.subscriptionId
                        }
                    ));
                    ws.send(JSON.stringify(
                        {
                            operation: 'create',
                            subscriptionId: data.subscriptionId,
                            document: {
                                chat: 'test'
                            }
                        }
                    ));
                    break;
                case 'unsubscribe':
                    ws.send(JSON.stringify(
                        {
                            operation: 'unsubscribed',
                            subscriptionId: data.subscriptionId,
                        }
                    ));
                    break;
            }
        }
    }

    _onError(error) {
        console.log(error);
    }
}

beforeAll((done) => {
    const server = http.createServer();
    server.listen(port);
    const wss = new SocketServer(server);
    wss.start()
        .then(done);
});
describe('LiveQuery', function () {
    it('should open event', function (done) {
        LiveQuery.on('open', () => {
            done();
        });
        LiveQuery.on('error', (error) => {
            done.fail(error);
        });
        LiveQuery.on('close', () => {
            done.fail('connection closed');
        });
        LiveQuery.open();
    });
    it('should subscribe', function (done) {
        const query = {
            collection: 'messages',
            where: {
                chat: 'test'
            }
        }
        const subscription = LiveQuery.subscribe(query);
        subscription.on('subscribe', () => {
            done();
        });

    });
    it('should subscribe to create', function (done) {
        const query = {
            collection: 'messages',
            where: {
                chat: 'test'
            }
        }
        const subscription = LiveQuery.subscribe(query);
        subscription.on('create', (document) => {
            expect(document.chat).toEqual('test');
            done();
        });
    });
    it('should un subscribe', function (done) {
        const query = {
            collection: 'messages',
            where: {
                chat: 'test'
            }
        }
        const subscription = LiveQuery.subscribe(query);
        subscription.on('close', () => {
            done();
        });
        subscription.unsubscribe();
    });
});