const EventEmitter = require('events');

class Subscription extends EventEmitter {
    constructor(id, query) {
        super();
        this.id = id;
        this.query = query;
        this.subscribed = false;
    }

    unsubscribe() {
        setTimeout(() => this.emit('unsubscribe'), 100);
    }
}

// The event the LiveQuery subscription should emit
Subscription.SUBSCRIBE = 'subscribe';
Subscription.CREATE = 'create';
Subscription.UPDATE = 'update';
Subscription.DELETE = 'delete';
Subscription.ENTER = 'enter';
Subscription.LEAVE = 'leave';
Subscription.ERROR = 'error';
Subscription.CLOSE = 'close';
module.exports = Subscription;
