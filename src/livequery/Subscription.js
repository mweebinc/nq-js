const EventEmitter = require('events');

/**
 * The model of each client subscription
 */
class Subscription extends EventEmitter {
    /**
     * @param id the sequence number subscription ID of the client
     * @param query @type {{collection: string,where: {}}}
     */
    constructor(id, query) {
        super();
        this.id = id + '';// make sure id is string
        this.query = query;
        this.subscribed = false;
    }

    /**
     * Unsubscribe to event
     */
    unsubscribe() {
        this.emit('unsubscribe');
    }
}

/**
 * The event the LiveQuery subscription should emit
 * @type {string}
 */
Subscription.SUBSCRIBE = 'subscribe';
Subscription.CREATE = 'create';
Subscription.UPDATE = 'update';
Subscription.DELETE = 'delete';
Subscription.ENTER = 'enter';
Subscription.LEAVE = 'leave';
Subscription.ERROR = 'error';
Subscription.CLOSE = 'close';
module.exports = Subscription;
