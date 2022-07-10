const EventEmitter = require('events');

/**
 * wrapper class for WebSocket Client
 */
class Socket extends EventEmitter {
    constructor(url) {
        super();
        this.url = url;
    }

    open() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => this.emit('open');
        this.ws.onmessage = message => {
            message = message && message.data ? message.data : message;
            try {
                message = JSON.parse(message);
            } catch (e) {
                console.log('unable to parse request', message, e);
                return;
            }
            this.emit('message', message);
        }
        this.ws.onclose = () => this.emit('close');
        this.ws.onerror = (error) => this.emit('error', error);
    }

    send(data) {
        try {
            data = JSON.stringify(data);
        } catch (error) {
            return;
        }
        this.ws.send(data);
    }

    close() {
        this.ws.close();
    }

}

module.exports = Socket;
