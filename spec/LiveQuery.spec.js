const Config = require('../src/Config');
const http = require('http');
WebSocket = require('ws');
const LiveQuery = require('../src/livequery/LiveQuery');

const port = 5683;
const url = 'ws://localhost:' + port;
const applicationId = 'test';
Config.set('LIVEQUERY_SERVER_URL', url);
Config.set('APPLICATION_ID', applicationId);


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
                            object: data.query.where
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
            collection: 'chats',
            where: {
                message: 'test'
            }
        }
        const subscription = LiveQuery.subscribe(query);
        expect(subscription.id).toEqual('1');
        expect(subscription.subscribed).toBeFalse();
        expect(subscription.query).toEqual(query);
        subscription.on('subscribe', () => {
            expect(subscription.subscribed).toBeTrue();
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
    it('should subscribe to create', function (done) {
        const query = {
            collection: 'chats',
            where: {
                message: 'test'
            }
        }
        const subscription = LiveQuery.subscribe(query);
        expect(subscription.query).toEqual(query);
        subscription.on('create', (data) => {
            expect(data).toEqual(query.where);
            done();
        });
        LiveQuery.open();
    });
    it('should unsubscribe', function (done) {
        const query = {
            collection: 'chats',
            where: {
                message: 'test'
            }
        }
        const subscription = LiveQuery.subscribe(query);
        const subscription2 = LiveQuery.subscribe(query);
        expect(subscription.query).toEqual(query);
        subscription.on('subscribe', () => {
            subscription.unsubscribe();
        });
        subscription.on('close', () => {
            LiveQuery.unsubscribe(subscription2);
        })
        subscription2.on('close', () => {
            done();
        })
        LiveQuery.open();
    });
});