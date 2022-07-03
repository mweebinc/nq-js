const EventEmitter = require('events');

const LiveQueryClient = require('../src/livequery/LiveQueryClient');

const applicationId = 'appId';
const session = 'sessionTest';

// mock Socket
class Socket extends EventEmitter {
    open() {
        this.emit('open');
    }

    send(data) {
        switch (data.operation) {
            case 'connect':
                expect(data.applicationId).toEqual(applicationId);
                expect(data.sessionToken).toEqual(session);
                setTimeout(() => this._pushConnected(), 100);// simulate network delay
                break;
            case 'subscribe':
                expect(data.subscriptionId).toBeDefined();
                expect(data.query).toBeDefined();
                this._pushSubscribed(data.subscriptionId);
                break;
            case 'unsubscribe':
                expect(data.subscriptionId).toBeDefined();
                this._pushUnsubscribed(data.subscriptionId);
                break;
        }
    }

    _pushConnected() {
        const data = {
            operation: 'connected'
        }
        this.emit('message', data);
    }

    _pushSubscribed(id) {
        const data = {
            operation: 'subscribed',
            subscriptionId: id
        }
        this.emit('message', data);
        this._pushCreated(id);
        this._pushUpdated(id);
        this._pushDeleted(id);
    }

    _pushCreated(id) {
        const data = {
            operation: 'create',
            subscriptionId: id,
            document: {
                chat: 'test'
            }
        }
        this.emit('message', data);
    }

    _pushUpdated(id) {
        const data = {
            operation: 'update',
            subscriptionId: id,
            document: {
                chat: 'test'
            }
        }
        this.emit('message', data);
    }

    _pushDeleted(id) {
        const data = {
            operation: 'delete',
            subscriptionId: id,
            document: {
                chat: 'test'
            }
        }
        this.emit('message', data);
    }

    _pushUnsubscribed(id) {
        const data = {
            operation: 'unsubscribed',
            subscriptionId: id,
        }
        this.emit('message', data);
    }
}

describe('LiveQueryClient', function () {
    const socket = new Socket();
    const client = new LiveQueryClient(socket, applicationId, session);
    it('should open connection', function (done) {
        client.open();
        client.on('open', () => {
            done();
        });
        client.on('close', () => {
            done.fail('connection closed');
        });
        client.on('error', (error) => {
            done.fail(error);
        });
    });
    it('should subscribe', function (done) {
        const query = {
            collection: 'messages',
            where: {
                chat: 'test'
            }
        }
        const subscription = client.subscribe(query);
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
        const subscription = client.subscribe(query);
        subscription.on('create', (document) => {
            expect(document.chat).toEqual('test');
            done();
        });
    });
    it('should subscribe to update', function (done) {
        const query = {
            collection: 'messages',
            where: {
                chat: 'test'
            }
        }
        const subscription = client.subscribe(query);
        subscription.on('update', (document) => {
            expect(document.chat).toEqual('test');
            done();
        });
    });
    it('should subscribe to delete', function (done) {
        const query = {
            collection: 'messages',
            where: {
                chat: 'test'
            }
        }
        const subscription = client.subscribe(query);
        subscription.on('delete', (document) => {
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
        const subscription = client.subscribe(query);
        subscription.on('close', () => {
            expect(client.subscriptions.get(subscription.id)).toBeUndefined();
            done();
        });
        subscription.unsubscribe();
    });
});
describe('LiveQueryClient Delay', function () {
    const socket = new Socket();
    const client = new LiveQueryClient(socket, applicationId, session);
    it('should connect first', function (done) {
        const query = {
            collection: 'messages',
            where: {
                chat: 'test'
            }
        }
        const subscription = client.subscribe(query);
        subscription.on('subscribe', () => {
            done();
        });
        client.open();
    });
});
