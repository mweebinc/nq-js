const LiveQueryClient = require('./LiveQueryClient');
const EventEmitter = require('events');
const promise = require('../promise');
const Subscription = require("./Subscription");

/**
 * The connection State
 * @type {{}}
 */
const STATE = {
    INITIALIZED: 'initialized',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    CLOSED: 'closed',
    RECONNECTING: 'reconnecting',
    DISCONNECTED: 'disconnected',
};

/**
 * This class handle the connection state of the LiveQueryClient
 */
class LiveQueryConnection extends EventEmitter {
    /**
     * @param ws WebSocketAdapter
     * @param applicationId The current Application ID
     * @param sessionToken Session token of current user
     */
    constructor(applicationId, ws, sessionToken) {
        super();
        this.client = new LiveQueryClient(applicationId, ws, sessionToken);
        this.ws = ws;
        this.state = STATE.INITIALIZED;
        this.connectionPromise = promise();
        this.attempts = 1;// reconnect attempts
        // Bind WebSocket callbacks
        this.ws.on('open', this._onOpen.bind(this));
        this.ws.on('message', this._onMessage.bind(this));
        this.ws.on('close', this._onClose.bind(this));
        this.ws.on('error', this._onError.bind(this));
        // prevent Unhandled error
        this.on('error', () => {
        });
    }

    /**
     * Open the connection
     */
    open() {
        // change current state to connecting
        if (this.state !== STATE.RECONNECTING) {
            this.state = STATE.CONNECTING;
        }
        this.ws.open();
    }

    /**
     * Close the connection
     */
    close() {
        // check if already close
        if (this.state === STATE.INITIALIZED || this.state === STATE.DISCONNECTED) {
            return;
        }
        this.state = STATE.DISCONNECTED;
        this.client.close(this.connectionPromise, true);
        this.ws.close();
        this.emit('close');
    }

    /**
     * Subscribe to the collection
     * @param query
     * @returns {Subscription}
     */
    subscribe(query) {
        return this.client.subscribe(query, this.connectionPromise);
    }

    /**
     * Unsubscribe to the collection
     * @param subscription @type {Subscription}
     */
    unsubscribe(subscription) {
        this.client.unsubscribe(subscription, this.connectionPromise);
    }

    /**
     * When the connection is open
     * @private
     */
    _onOpen() {
        this.client.connect();
    }

    /**
     * When server send the data
     * @private
     */
    _onMessage(data) {
        const subscription = this.client.subscriptions.get(data.subscriptionId);
        switch (data.operation) {
            case 'connected':
                // if state from reconnecting resubscribe all subscriptions
                if (this.state === STATE.RECONNECTING) {
                    this.client.resubscribe(this.connectionPromise);
                }
                this.state = STATE.CONNECTED;
                this.connectionPromise.resolve();
                this.emit('open');
                break;
            case 'subscribed':
                if (subscription) {
                    subscription.subscribed = true;
                    subscription.emit(Subscription.SUBSCRIBE, data);
                }
                break;
            case 'unsubscribed':
                if (subscription) {
                    subscription.subscribed = false;
                    this.client.subscriptions.delete(subscription.id);
                    subscription.emit(Subscription.CLOSE);
                }
                break;
            case 'error':
                this.emit('error', data.error);
                this.connectionPromise.reject(data);
                this.state = STATE.DISCONNECTED;
                break;
            default:
                // create, update, delete, enter, leave cases
                if (subscription && subscription.subscribed) {
                    subscription.emit(data.operation, data.object);
                }
        }
    }

    /**
     * When connection is closed
     * @private
     */
    _onClose() {
        if (this.state !== STATE.CONNECTED) {
            return;
        }
        this.state = STATE.CLOSED;
        this.emit('close');
        // notify all subscription about close
        this.client.close();
        this._reconnect();
    }

    /**
     * When error occurs
     * @param error
     * @private
     */
    _onError(error) {
        this.emit('error', error);
        // @todo
        // for (const subscription of this.client.subscriptions.values()) {
        //     subscription.emit(Subscription.ERROR, error);
        // }
        this._reconnect();
    }

    /**
     * Reconnect to the server
     * @private
     */
    _reconnect() {
        // if disconnected or currently reconnecting we stop attempting to reconnect
        if (this.state === STATE.DISCONNECTED || this.state === STATE.RECONNECTING) {
            return;
        }
        this.state = STATE.RECONNECTING;
        if (this.reconnectTimeoutId) {
            clearTimeout(this.reconnectTimeoutId);
        }
        // reconnect at frequent rates
        const time = Math.random() * Math.min(30, Math.pow(2, this.attempts) - 1) * 1000;
        this.reconnectTimeoutId = setTimeout(() => {
            this.attempts++;
            this.connectionPromise = promise();
            this.open();
        }, time);
    }

    /**
     * Reset all variable
     * @private
     */
    _reset() {
        this.id = 0;
        this.connectPromise = promise();
    }
}

LiveQueryConnection.STATE = STATE;
module.exports = LiveQueryConnection;
