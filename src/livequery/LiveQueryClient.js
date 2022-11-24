const EventEmitter = require('events');
const Subscription = require('./Subscription');
const promise = require('../promise');

// The event we get back from LiveQuery server
const OP_EVENTS = {
    CONNECTED: 'connected',
    SUBSCRIBED: 'subscribed',
    UNSUBSCRIBED: 'unsubscribed',
    ERROR: 'error',
    CREATE: 'create',
    UPDATE: 'update',
    ENTER: 'enter',
    LEAVE: 'leave',
    DELETE: 'delete',
};
// The event type the LiveQuery client should sent to server
const OP_TYPES = {
    CONNECT: 'connect',
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    ERROR: 'error',
};
// The event the LiveQuery client should emit
const CLIENT_EMITTER_TYPES = {
    CLOSE: 'close',
    ERROR: 'error',
    OPEN: 'open',
};
// The LiveQuery client inner state
const STATE = {
    INITIALIZED: 'initialized',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    CLOSED: 'closed',
    RECONNECTING: 'reconnecting',
    DISCONNECTED: 'disconnected',
};

class LiveQueryClient extends EventEmitter {
    constructor(socket, applicationId, sessionToken) {
        super();
        this.socket = socket;
        this.applicationId = applicationId;
        this.sessionToken = sessionToken;
        this.subscriptions = new Map();// list of Subscription class
        this.subscriptionId = 1;
        this.state = STATE.INITIALIZED;
        // Bind WebSocket callbacks
        this.socket.on('open', this._pushAuthentication.bind(this));
        this.socket.on('message', this._onMessage.bind(this));
        this.socket.on('close', this._onClose.bind(this));
        this.socket.on('error', this._onError.bind(this));
        // prevent Unhandled error
        this.on('error', () => {
        });
    }

    open() {
        if (this.connectPromise) {
            return this.connectPromise;
        }
        if (this.state !== STATE.RECONNECTING) {
            this.state = STATE.CONNECTING;
        }
        this.connectPromise = promise();
        setTimeout(() => this.socket.open());
        return this.connectPromise;
    }

    subscribe(query) {
        console.log("subscribe");
        const data = {
            operation: OP_TYPES.SUBSCRIBE,
            subscriptionId: this.subscriptionId,
            query: query
        }
        const subscription = new Subscription(this.subscriptionId, query);
        this.subscriptions.set(this.subscriptionId, subscription);
        this.subscriptionId++;
        this.open()
            .then(() => this.socket.send(data));
        return subscription;
    }

    unsubscribe(subscription) {
        console.log("unsubscribe");
        if (subscription) {
            subscription.subscribed = false;
            const data = {
                operation: OP_TYPES.UNSUBSCRIBE,
                subscriptionId: subscription.id,
            };
            this.connectPromise
                .then(() => this.socket.send(data));
        }
    }

    close() {
        console.log("close");
        if (this.state === STATE.INITIALIZED || this.state === STATE.DISCONNECTED) {
            return;
        }
        this.state = STATE.DISCONNECTED;
        this.socket.close();
        // Notify each subscription about the close
        for (const subscription of this.subscriptions.values()) {
            subscription.subscribed = false;
            subscription.emit(Subscription.CLOSE);
        }
        this._reset();
        this.emit(CLIENT_EMITTER_TYPES.CLOSE);
    }

    _pushAuthentication() {
        // send authentication
        const connectRequest = {
            operation: OP_TYPES.CONNECT,
            applicationId: this.applicationId,
            sessionToken: this.sessionToken,
        };
        this.socket.send(connectRequest);
    }

    _onMessage(data) {
        const subscription = this.subscriptions.get(data.subscriptionId);
        switch (data.operation) {
            case OP_EVENTS.CONNECTED:
                this.connectPromise.resolve();
                this.emit(CLIENT_EMITTER_TYPES.OPEN);
                this.state = STATE.CONNECTED;
                this._resubscribe();
                break;
            case OP_EVENTS.SUBSCRIBED:
                if (subscription) {
                    subscription.subscribed = true;
                    subscription.on('unsubscribe', () => {
                        this.unsubscribe(subscription);
                    })
                    setTimeout(() => subscription.emit(Subscription.SUBSCRIBE, data));
                }
                break;
            case OP_EVENTS.ERROR:
                this.emit(CLIENT_EMITTER_TYPES.ERROR, data.error);
                if (!this.id) {
                    this.connectPromise.reject(data);
                    this.state = STATE.DISCONNECTED;
                }
                break;
            case OP_EVENTS.UNSUBSCRIBED:
                this.subscriptions.delete(subscription.id);
                subscription.emit('close');
                break;
            default:
                // create, update, delete, enter, leave cases
                if (subscription && subscription.subscribed) {
                    setTimeout(() => subscription.emit(data.operation, data.document));
                }
        }
    }

    _onClose() {
        console.log("_onClose");
        if (this.state === STATE.DISCONNECTED) {
            return;
        }
        this.state = STATE.CLOSED;
        this.emit(CLIENT_EMITTER_TYPES.CLOSE);
        // Notify each subscription about the close
        for (const subscription of this.subscriptions.values()) {
            subscription.emit(Subscription.CLOSE);
        }
        this._reconnect();
    }

    _onError(error) {
        this.emit(CLIENT_EMITTER_TYPES.ERROR, error);
        for (const subscription of this.subscriptions.values()) {
            subscription.emit(Subscription.ERROR, error);
        }
        this._reconnect();
    }

    _reset() {
        this.id = 0;
        this.subscriptionId = 1;
        this.connectPromise = promise();
        this.subscriptions = new Map();
    }

    _reconnect() {
        console.log("_reconnect");
        // if closed or currently reconnecting we stop attempting to reconnect
        if (this.state === STATE.DISCONNECTED) {
            return;
        }
        this.state = STATE.RECONNECTING;
        if (this.reconnectTimeoutId) {
            clearTimeout(this.reconnectTimeoutId);
        }
        // reconnect every 5 second
        this.reconnectTimeoutId = setTimeout(() => {
            this.connectPromise = undefined;
            this.open();
        }, 3000);
    }

    _resubscribe() {
        this.subscriptions.forEach((subscription, subscriptionId) => {
            const data = {
                operation: OP_TYPES.SUBSCRIBE,
                subscriptionId: subscriptionId,
                query: subscription.query
            }
            this.connectPromise
                .then(() => this.socket.send(data));
        });
    }
}

module.exports = LiveQueryClient;
