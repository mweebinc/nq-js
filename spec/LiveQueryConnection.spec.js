const EventEmitter = require('events');
const LiveQueryConnection = require('../src/livequery/LiveQueryConnection');
const Subscription = require('../src/livequery/Subscription');

// mock WebSocket
class Socket extends EventEmitter {
    /**
     * When open is call fake on-open is triggered
     */
    open() {
        this.emit('open');
    }

    /**
     * When send function is called emit the data
     * setTimeout used to simulate the server delay
     * @param data
     */
    send(data) {
        switch (data.operation) {
            case 'connect':
                setTimeout(() => this.emit('message', {
                    operation: 'connected'
                }));
                break;
            case 'subscribe':
                setTimeout(() => this.emit('message', {
                    operation: 'subscribed',
                    subscriptionId: data.subscriptionId
                }));
                setTimeout(() => this.emit('message', {
                    operation: 'create',
                    subscriptionId: data.subscriptionId,
                    object: data.query.where
                }));
                break;
            case 'unsubscribe':
                setTimeout(() => setTimeout(() => this.emit('message', {
                    operation: 'unsubscribed',
                    subscriptionId: data.subscriptionId
                })));
                break;
        }
        // emit the data to validate
        this.emit('send', data);
    }

    /**
     * When close is called
     */
    close() {
        this.emit('close');
    }

}

describe('LiveQueryConnection', function () {
    it('should open connection', function (done) {
        const applicationId = 'test';
        // create websocket mock
        const ws = new Socket();
        // listen to send event
        ws.on('send', data => {
            expect(data).toEqual({operation: 'connect', applicationId: 'test', sessionToken: 'token'});
        });
        const session = 'token';
        const connection = new LiveQueryConnection(applicationId, ws, session);
        // listen to open event
        connection.on('open', () => {
            expect(connection.state).toEqual(LiveQueryConnection.STATE.CONNECTED);
            done();
        });
        expect(connection.state).toEqual(LiveQueryConnection.STATE.INITIALIZED);
        connection.open();
        expect(connection.state).toEqual(LiveQueryConnection.STATE.CONNECTING);
    });
    it('should subscribe', function (done) {
        const applicationId = 'test';
        const query = {
            collection: 'chats',
            where: {message: 'hi'}
        };
        // create websocket mock
        const ws = new Socket();
        // listen to send event
        let id = 1;
        ws.on('send', data => {
            if (data.operation === 'subscribe') {
                expect(data.subscriptionId).toEqual(id);
                expect(data.query).toEqual(query);
                id++;
            }
        });
        const connection = new LiveQueryConnection(applicationId, ws);
        const subscription = connection.subscribe(query);
        expect(subscription.subscribed).toBeFalse();
        subscription.on(Subscription.SUBSCRIBE, (data) => {
            expect(data).toEqual({operation: 'subscribed', subscriptionId: 1});
            expect(subscription.subscribed).toBeTrue();
        });
        connection.open();
        const subscription2 = connection.subscribe(query);
        expect(subscription2.subscribed).toBeFalse();
        expect(connection.client.subscriptions.size).toEqual(2);
        subscription2.on(Subscription.SUBSCRIBE, (data) => {
            expect(data).toEqual({operation: 'subscribed', subscriptionId: 2});
            expect(subscription2.subscribed).toBeTrue();
            done();
        });
    });
    it('should subscribe to create', function (done) {
        const applicationId = 'test';
        const query = {
            collection: 'chats',
            where: {message: 'hi'}
        };
        // create websocket mock
        const ws = new Socket();
        const connection = new LiveQueryConnection(applicationId, ws);
        const subscription = connection.subscribe(query);
        subscription.on('create', object => {
            expect(object).toEqual(query.where);
            done();
        });
        connection.open();
    });
    it('should unsubscribe', function (done) {
        const query = {
            collection: 'chats',
            where: {message: 'hi'}
        };
        // create websocket mock
        const ws = new Socket();
        // listen to send event
        let id = 2;
        ws.on('send', data => {
            if (data.operation === 'unsubscribe') {
                expect(data.subscriptionId).toEqual(id);
                id++;
            }
        });
        const connection = new LiveQueryConnection('test', ws, 'token');
        const subscription = connection.subscribe(query);
        const subscription2 = connection.subscribe(query);
        const subscription3 = connection.subscribe(query);
        connection.open();
        expect(connection.client.subscriptions.size).toEqual(3);
        subscription.on(Subscription.CLOSE, () => {
            done.fail('it should not called');
        })
        subscription2.on(Subscription.CLOSE, () => {
            expect(connection.client.subscriptions.size).toEqual(2);
            expect(subscription2.subscribed).toBeFalse();
        })
        subscription3.on(Subscription.CLOSE, () => {
            expect(connection.client.subscriptions.size).toEqual(1);
            expect(subscription3.subscribed).toBeFalse();
            done();
        })
        connection.unsubscribe(subscription2);
        subscription3.unsubscribe();
    });
    it('should close', function (done) {
        const applicationId = 'test';
        const query = {
            collection: 'chats',
            where: {message: 'hi'}
        };
        // create websocket mock
        const ws = new Socket();
        const connection = new LiveQueryConnection(applicationId, ws);
        const subscription = connection.subscribe(query);
        const subscription2 = connection.subscribe(query);
        expect(connection.client.subscriptions.size).toEqual(2);
        connection.open();
        let count = 1;
        subscription.on(Subscription.CLOSE, () => {
            count++;
        })
        subscription2.on(Subscription.CLOSE, () => {
            expect(count).toEqual(2);
        })
        connection.on('close', () => {
            expect(connection.client.subscriptions.size).toEqual(0);
            expect(connection.client.subscriptionId).toEqual(1);
            done();
        });
        connection.close();
        connection.close();
        expect(connection.state).toEqual(LiveQueryConnection.STATE.DISCONNECTED);
    });
    it('should reconnect', function (done) {
        const applicationId = 'test';
        const query = {
            collection: 'chats',
            where: {message: 'hi'}
        };
        // create websocket mock
        const ws = new Socket();
        const connection = new LiveQueryConnection(applicationId, ws);
        const subscription = connection.subscribe(query);
        let isClosed = false;
        let isOpened = false;
        subscription.on(Subscription.CLOSE, () => {
            isClosed = true;
        });
        subscription.on(Subscription.SUBSCRIBE, () => {
            if (isClosed) {
                expect(isClosed).toBeTrue();
                expect(isOpened).toBeTrue();
                done();
            } else {
                // manual trigger the on close
                ws.emit('close');
            }
        })
        connection.open();
        connection.on('open', () => {
            if (isClosed) {
                isOpened = true;
            }
        });
    });
});

