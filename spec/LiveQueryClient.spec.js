const EventEmitter = require('events');
const LiveQueryClient = require('../src/livequery/LiveQueryClient');

describe('LiveQueryClient', function () {
    it('should send connect', function (done) {
        const applicationId = 'test';
        const ws = {
            send: function (data) {
                expect(data).toEqual({operation: 'connect', applicationId: 'test'});
            }
        };
        const client = new LiveQueryClient(applicationId, ws);
        client.connect();
        // test with token
        const ws2 = {
            send: function (data) {
                expect(data).toEqual({operation: 'connect', applicationId: 'test', sessionToken: 'token'});
            }
        };
        const client2 = new LiveQueryClient(applicationId, ws2, 'token');
        client2.connect();
        // test with token in parameter
        const ws3 = {
            send: function (data) {
                expect(data).toEqual({operation: 'connect', applicationId: 'test', sessionToken: 'new-token'});
                done();
            }
        };
        const client3 = new LiveQueryClient(applicationId, ws3, 'token');
        client3.connect('new-token');
    });
    it('should send subscribe', function (done) {
        const applicationId = 'test';
        const query = {
            collection: 'chats',
            where: {
                message: 'hi'
            }
        };
        let id = 1;
        const ws = {
            send: function (data) {
                expect(data.operation).toEqual('subscribe');
                expect(data.subscriptionId).toEqual(id + '');
                expect(data.query).toEqual(query);
                id++;
                if (data.subscriptionId === '3') {
                    done();
                }
            }
        };
        const client = new LiveQueryClient(applicationId, ws);
        const subscription1 = client.subscribe(query, Promise.resolve());
        const subscription2 = client.subscribe(query, Promise.resolve());
        const subscription3 = client.subscribe(query, Promise.resolve());
        expect(subscription1.id).toEqual('1');
        expect(subscription2.id).toEqual('2');
        expect(subscription3.id).toEqual('3');
        expect(subscription1).toBeInstanceOf(EventEmitter);
        expect(subscription1.subscribed).toBeFalse();
        expect(subscription1.query).toEqual(query);
    });
    it('should send unsubscribe', function (done) {
        const applicationId = 'test';
        const query = {collection: 'chats', where: {message: 'hi'}};
        const ws = {
            send: function (data) {
                if (data.operation === 'unsubscribe') {
                    done();
                }
            }
        };
        const client = new LiveQueryClient(applicationId, ws);
        const subscription = client.subscribe(query, Promise.resolve());
        client.unsubscribe(subscription, Promise.resolve());
    });
    it('should resubscribe', function (done) {
        const applicationId = 'test';
        const query = {collection: 'chats', where: {message: 'hi'}};
        let count = 1;
        let id = 1;
        const ws = {
            send: function (data) {
                expect(data.operation).toEqual('subscribe');
                expect(data.subscriptionId).toEqual(id + '');
                expect(data.query).toEqual(query);
                id++;
                count++;
                if (id === 4) {
                    id = 1;
                }
                if (count === 6) {
                    done();
                }
            }
        };
        const client = new LiveQueryClient(applicationId, ws);
        client.subscribe(query, Promise.resolve());
        client.subscribe(query, Promise.resolve());
        client.subscribe(query, Promise.resolve());
        client.resubscribe(Promise.resolve());
    });
    it('should close subscription', function (done) {
        const applicationId = 'test';
        const query = {collection: 'chats', where: {message: 'hi'}};
        const ws = {
            send: function (data) {
                expect(data.operation).toEqual('subscribe');
                expect(data.subscriptionId).toEqual('1');
                expect(data.query).toEqual(query);
            }
        };
        const client = new LiveQueryClient(applicationId, ws);
        const subscription = client.subscribe(query, Promise.resolve());
        subscription.subscribed = true;
        subscription.on('close', () => {
            expect(subscription.subscribed).toBeTrue();
            done();
        });
        client.close();
    });
});